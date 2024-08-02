import { useState, useEffect, useCallback } from 'react';
import { openDatabase, createTable } from '../utils/database';
import {
  registerForPushNotificationsAsync,
  scheduledTimeNotifications,
} from '../utils/notifications';
import { checkFixedTasks } from '../utils/timeUitls';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [temporizador, setTemporizador] = useState(0);
  const [startDay, setStartDay] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const db = openDatabase();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      createTable(db);

      const getTasks = async () => {
        try {
          const tasks = await db.getAllAsync('SELECT * FROM tasks');
          setTasks(tasks);
        } catch (error) {
          console.log(error);
        }
      };

      getTasks();
    }, [startDay])
  );

  useEffect(() => {
    let countdown;
    if (startDay === 1 && remainingTime > 0) {
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setStartDay(2);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [startDay, remainingTime]);

  const handleStartDay = () => {
    if (startDay === 0) {
      const startTime = new Date();
      let currentTime = startTime;

      if (temporizador > 0) {
        setRemainingTime(temporizador * 60);
        setStartDay(1);
        currentTime.setMinutes(currentTime.getMinutes() + temporizador);
      } else {
        setStartDay(2);
      }

      const fixedTasks = tasks.filter((task) => task.fixed === 1);

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
    remainingTime,
    setTemporizador,
    handleStartDay,
    deleteTask,
  };
};
