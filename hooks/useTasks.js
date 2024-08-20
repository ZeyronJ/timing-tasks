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

      const updatedTasks = tasks.map((task, i) => {
        if (task.fixed === 0) {
          currentTime = new Date(
            checkFixedTasks(task, currentTime, fixedTasks)
          );
          // console.log(`${task.title} - ${currentTime.toLocaleString()}`);

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
      setTasks(updatedTasks);
      scheduledTimeNotifications(updatedTasks);
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
    });
    setStartDay(0);
    saveStartDay(db, 0);
    Notifications.cancelAllScheduledNotificationsAsync();
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
