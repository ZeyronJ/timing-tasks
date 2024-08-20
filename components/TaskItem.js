import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { openDatabase } from '../utils/database';

const TaskItem = ({ task, deleteTask }) => {
  const db = openDatabase();
  const res = db.getFirstSync('SELECT startDay FROM config WHERE id = 1');
  const startDay = res.startDay;
  // console.log('TaskItem-startDay:', startDay);
  return (
    <TouchableOpacity
      onLongPress={() => deleteTask(task.id)}
      delayLongPress={1000}
      className='flex-row flex-wrap bg-white rounded-lg p-2 mb-2 border border-gray-300 shadow shadow-black dark:bg-[#333] dark:border-[#555]'
      onPress={() =>
        router.navigate({
          pathname: 'tasks/createTask',
          params: { taskId: task.id },
        })
      }
      disabled={startDay !== 0}
    >
      <Text className='font-bold text-gray-800 w-1/2 dark:text-white'>
        {task.title}
      </Text>
      <Text className='font-semibold w-1/2 dark:text-white'>
        Descanso: {task.rest}m
      </Text>
      <Text className='italic text-sm w-1/2 dark:text-white'>
        Inicio: {task.startTime}
      </Text>
      <Text className='italic text-sm w-1/2 dark:text-white'>
        Fin: {task.endTime}
      </Text>
    </TouchableOpacity>
  );
};

export default TaskItem;
