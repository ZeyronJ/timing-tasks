import { useState, useEffect, useCallback } from 'react';
import { openDatabase, createTable, saveStartDay } from '../utils/database';
import {
  registerForPushNotificationsAsync,
  scheduledTimeNotifications,
} from '../utils/notifications';
import { checkFixedTasks, updateFixedTasks } from '../utils/timeUitls';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useColorScheme } from 'nativewind';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  // const [remainingTime, setRemainingTime] = useState(0);
  const [startDay, setStartDay] = useState(0);
  const [temporizador, setTemporizador] = useState(0);

  const [selectedPage, setSelectedPage] = useState(1);
  const { colorScheme, setColorScheme } = useColorScheme();

  const [fixedTasks, setFixedTasks] = useState([]);

  const db = openDatabase();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      createTable(db);
      console.log('focusEffect');
      let page = 1;

      const getConfig = () => {
        try {
          let resConfig = db.getFirstSync('SELECT * FROM config WHERE id = 1');
          if (resConfig) {
            // console.log('cargando config...');
          } else {
            console.log('asignando primer config...');
            db.execSync(`
                INSERT INTO config (id) VALUES (1);
              `);
            const firstConfig = db.getFirstSync(
              'SELECT * FROM config WHERE id = 1'
            );
            resConfig = firstConfig;
          }
          // console.log('config:', resConfig);
          setColorScheme(resConfig.colorScheme);
          setSelectedPage(resConfig.selectedPage);
          setTemporizador(resConfig.temporizador);
          setStartDay(resConfig.startDay);
          page = resConfig.selectedPage;

          const tasks = db.getAllSync(
            `SELECT * FROM tasks WHERE page = ${page}`
          );
          setTasks(tasks);
          const fixedTasks = tasks.filter((task) => task.fixed === 1);
          setFixedTasks(fixedTasks);
          updateFixedTasks(fixedTasks);
          // console.log(tasks);
        } catch (error) {
          console.log(error);
        }
      };

      getConfig();

      // getTasks();
    }, [startDay, selectedPage])
  );

  const handleStartDay = () => {
    if (startDay === 0) {
      const startTime = new Date();
      let currentTime = startTime;

      setStartDay(2);
      saveStartDay(db, 2);

      if (temporizador > 0)
        currentTime.setMinutes(currentTime.getMinutes() + temporizador);

      // Primero, procesar todas las tareas dinámicas y asignarles horarios
      const updatedTasks = tasks.map((task, i) => {
        if (task.fixed === 0) {
          currentTime = new Date(
            checkFixedTasks(task, currentTime, fixedTasks)
          );

          const startTaskTime = new Date(currentTime);
          currentTime.setMinutes(currentTime.getMinutes() + task.duration);
          const endTaskTime = new Date(currentTime);

          db.execSync(`
            UPDATE tasks 
            SET startTime = '${startTaskTime.toISOString()}', 
                endTime = '${endTaskTime.toISOString()}' 
            WHERE id = ${task.id}
          `);

          currentTime.setMinutes(currentTime.getMinutes() + task.rest);

          return {
            ...task,
            startTime: startTaskTime.toISOString(),
            endTime: endTaskTime.toISOString(),
          };
        } else {
          return task;
        }
      });

      // Ahora obtener TODAS las tareas (dinámicas y fijas) con sus horarios actualizados
      const allTasksWithTimes = db.getAllSync(
        `SELECT * FROM tasks WHERE page = ${selectedPage} AND fixed IN (0, 1) ORDER BY startTime`
      );

      console.log('=== TODAS LAS TAREAS ORDENADAS ===');
      allTasksWithTimes.forEach((task) => {
        console.log(
          `${task.title}: ${new Date(
            task.startTime
          ).toLocaleTimeString()} - ${new Date(
            task.endTime
          ).toLocaleTimeString()} (rest: ${task.rest}m)`
        );
      });

      // Detectar espacios vacíos entre tareas consecutivas
      for (let i = 0; i < allTasksWithTimes.length - 1; i++) {
        const currentTask = allTasksWithTimes[i];
        const nextTask = allTasksWithTimes[i + 1];

        const currentEndTime = new Date(currentTask.endTime);
        // Agregar el descanso de la tarea actual
        currentEndTime.setMinutes(
          currentEndTime.getMinutes() + currentTask.rest
        );

        const nextStartTime = new Date(nextTask.startTime);

        // Calcular la diferencia en minutos
        const gapMinutes = (nextStartTime - currentEndTime) / 60000;

        console.log(
          `Gap entre ${
            currentTask.title
          } (termina: ${currentEndTime.toLocaleTimeString()}) y ${
            nextTask.title
          } (empieza: ${nextStartTime.toLocaleTimeString()}): ${gapMinutes} minutos`
        );

        // Si hay un espacio vacío mayor a 0 minutos
        if (gapMinutes > 0) {
          console.log(
            `Creando tarea de productividad de ${Math.round(
              gapMinutes
            )} minutos`
          );
          db.execSync(`
            INSERT INTO tasks (page, title, duration, rest, startTime, endTime, fixed)
            VALUES (
              ${selectedPage},
              'Productividad',
              ${Math.round(gapMinutes)},
              0,
              '${currentEndTime.toISOString()}',
              '${nextStartTime.toISOString()}',
              2
            )
          `);
        }
      }

      // Recargar todas las tareas para incluir las nuevas tareas de productividad
      const allTasks = db.getAllSync(
        `SELECT * FROM tasks WHERE page = ${selectedPage}`
      );
      setTasks(allTasks);
      scheduledTimeNotifications(allTasks);
    } else {
      handleEndDay();
    }
  };

  const handleEndDay = () => {
    tasks.forEach((task) => {
      if (task.fixed === 0) {
        db.execSync(
          `UPDATE tasks SET startTime = 'No especificado', endTime = 'No especificado' WHERE id = ${task.id}`
        );
      }
      // Eliminar tareas de productividad autogeneradas (fixed = 2)
      if (task.fixed === 2) {
        db.execSync(`DELETE FROM tasks WHERE id = ${task.id}`);
      }
    });
    setStartDay(0);
    saveStartDay(db, 0);
    Notifications.cancelAllScheduledNotificationsAsync();

    // Recargar tareas después de eliminar las de productividad
    const remainingTasks = db.getAllSync(
      `SELECT * FROM tasks WHERE page = ${selectedPage}`
    );
    setTasks(remainingTasks);
  };

  const deleteTask = (id) => {
    db.execSync(`DELETE FROM tasks WHERE id = ${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return {
    tasks,
    temporizador,
    startDay,
    setTemporizador,
    handleStartDay,
    deleteTask,
    selectedPage,
    setStartDay,
    colorScheme,
    setSelectedPage,
  };
};
