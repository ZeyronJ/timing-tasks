import { openDatabase } from './database';

export const formatTimeFromSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatTimeFromDate = (date) => {
  if (!date) return '00:00';
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

export const updateFixedTasks = (fixedTasks) => {
  const updateDate = (original) => {
    const originalDate = new Date(original);

    // Obtener la hora original
    const hours = originalDate.getUTCHours();
    const minutes = originalDate.getUTCMinutes();
    const seconds = originalDate.getUTCSeconds();

    // Obtener la fecha actual
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth(); // Meses de 0 (enero) a 11 (diciembre)
    const currentDay = now.getUTCDate();

    // Crear la nueva fecha con la misma hora pero el día actual
    const updatedDate = new Date(
      Date.UTC(currentYear, currentMonth, currentDay, hours, minutes, seconds)
    );
    // console.log(updatedDate);
    return updatedDate;
  };

  fixedTasks.forEach((task) => {
    const newStartTime = updateDate(task.startTime);
    openDatabase().runSync(
      `UPDATE tasks SET startTime = '${newStartTime.toISOString()}' WHERE id = ${
        task.id
      }`
    );
    const newEndTime = updateDate(task.endTime);
    openDatabase().runSync(
      `UPDATE tasks SET endTime = '${newEndTime.toISOString()}' WHERE id = ${
        task.id
      }`
    );
  });
};

export const checkFixedTasks = (task, currentTime, fixedTasks) => {
  let currentTimeAux = new Date(currentTime);
  currentTimeAux.setMinutes(
    currentTimeAux.getMinutes() + task.duration + task.rest
  );
  currentTimeAux = currentTimeAux.toISOString();
  let flag = false;

  if (fixedTasks.length === 0) {
    return currentTime;
  }

  const exist = fixedTasks.find((fixedTask, i) => {
    if (flag) {
      return false;
    }
    const taskStartTimeISO = new Date(fixedTask.startTime).toISOString();
    const taskEndTimeISO = new Date(fixedTask.endTime).toISOString();
    // console.log(
    //   `primer if ${currentTimeAux} < ${taskStartTimeISO}, ${
    //     currentTimeAux < taskStartTimeISO
    //   }`
    // );
    if (currentTimeAux < taskStartTimeISO) {
      let newCurrentTime = new Date(currentTimeAux);
      newCurrentTime.setMinutes(
        newCurrentTime.getMinutes() - task.duration - task.rest
      );
      currentTime = new Date(newCurrentTime);
      // console.log('returning true');
      return true;
    }
    flag = true;
    // console.log(task);
    if (currentTime.toISOString() <= taskEndTimeISO) {
      const currentIndexTime = new Date(taskStartTimeISO);
      currentIndexTime.setMinutes(
        currentIndexTime.getMinutes() +
          fixedTask.duration +
          fixedTask.rest +
          task.duration +
          task.rest
      );
      currentTimeAux = currentIndexTime.toISOString();
    } else {
      flag = false;
      // console.log('xdd');
    }
    return false;
  });

  if (!exist) {
    const currentIndexTime = new Date(currentTimeAux);
    currentIndexTime.setMinutes(
      currentIndexTime.getMinutes() - task.duration - task.rest
    );
    currentTimeAux = currentIndexTime.toISOString();
    if (currentTimeAux >= currentTime.toISOString()) {
      currentTime = new Date(currentTimeAux);
    }
  }
  return currentTime;
};
