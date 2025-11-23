import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { openDatabase } from '../utils/database';

const TaskItem = ({ task, deleteTask }) => {
  const db = openDatabase();
  const res = db.getFirstSync('SELECT startDay FROM config WHERE id = 1');
  const startDay = res.startDay;
  const isProductivity = task.fixed === 2;

  // console.log('TaskItem-startDay:', startDay);
  return (
    <TouchableOpacity
      onLongPress={() => !isProductivity && deleteTask(task.id)}
      delayLongPress={1000}
      className={`flex-row flex-wrap rounded-lg p-2 mb-2 border shadow shadow-black ${
        isProductivity
          ? 'bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
          : 'bg-white border-gray-300 dark:bg-[#333] dark:border-[#555]'
      }`}
      onPress={() =>
        !isProductivity &&
        router.navigate({
          pathname: 'tasks/createTask',
          params: { taskId: task.id },
        })
      }
      disabled={startDay !== 0 || isProductivity}
    >
      <Text
        className={`font-bold w-1/2 ${
          isProductivity
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-gray-800 dark:text-white'
        }`}
      >
        {task.title} {isProductivity && '⏱️'}
      </Text>
      <Text
        className={`font-semibold w-1/2 ${
          isProductivity
            ? 'text-amber-700 dark:text-amber-300'
            : 'dark:text-white'
        }`}
      >
        Descanso: {task.rest}m
      </Text>
      <Text
        className={`italic text-sm w-1/2 ${
          isProductivity
            ? 'text-amber-600 dark:text-amber-400'
            : 'dark:text-white'
        }`}
      >
        Inicio: {task.startTime}
      </Text>
      <Text
        className={`italic text-sm w-1/2 ${
          isProductivity
            ? 'text-amber-600 dark:text-amber-400'
            : 'dark:text-white'
        }`}
      >
        Fin: {task.endTime}
      </Text>
    </TouchableOpacity>
  );
};

export default TaskItem;
