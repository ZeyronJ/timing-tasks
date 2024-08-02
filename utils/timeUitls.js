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
    if (currentTimeAux < taskStartTimeISO) {
      let newCurrentTime = new Date(currentTimeAux);
      newCurrentTime.setMinutes(
        newCurrentTime.getMinutes() - task.duration - task.rest
      );
      currentTime = new Date(newCurrentTime);
      return true;
    }
    flag = true;
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
