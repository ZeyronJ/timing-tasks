import { Text, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import Dropdown from '../components/Dropdown';
import TaskList from '../components/TaskList';
import Layout from '../components/Layout';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';
import { formatTimeFromSeconds } from '../utils/timeUitls';

const items = [
  { label: '0 minutos', value: 0 },
  { label: '1 minuto', value: 1 },
  { label: '2 minutos', value: 2 },
  { label: '5 minutos', value: 5 },
  { label: '10 minutos', value: 10 },
  { label: '15 minutos', value: 15 },
  { label: '30 minutos', value: 30 },
  { label: '60 minutos', value: 60 },
];

export default function Page() {
  const {
    tasks,
    temporizador,
    startDay,
    remainingTime,
    setTemporizador,
    handleStartDay,
    deleteTask,
  } = useTasks();
  const { colorScheme } = useColorScheme();

  return (
    <Layout>
      <TouchableOpacity onPress={handleStartDay}>
        <View
          className={`rounded-full w-28 h-28 flex items-center justify-center mb-4 border ${
            startDay === 0
              ? 'bg-blue-500 border-blue-600 dark:border-blue-700 dark:bg-blue-600'
              : startDay === 1
              ? 'bg-yellow-500 border-yellow-600 dark:border-yellow-700 dark:bg-yellow-600'
              : 'bg-red-500 border-red-600 dark:border-red-700 dark:bg-red-600'
          } `}
        >
          <Text className='text-white text-base font-semibold'>
            {startDay === 0
              ? 'Iniciar día'
              : startDay === 1
              ? formatTimeFromSeconds(remainingTime)
              : 'Finalizar día'}
          </Text>
        </View>
      </TouchableOpacity>
      <View className='flex flex-row'>
        <Text className='w-1/2'></Text>
        <Text
          className={`w-1/2 text-center ${
            startDay === 0
              ? 'dark:text-white'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Temporizador:
        </Text>
      </View>
      <View className='flex flex-row'>
        <View className='w-1/2 flex items-center justify-center'>
          <TouchableOpacity
            onPress={() => router.navigate('tasks/createTask')}
            disabled={startDay !== 0}
            className={`p-2 rounded ${
              startDay === 0
                ? 'bg-blue-500 dark:bg-blue-600'
                : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            <Text
              className={` ${
                startDay === 0
                  ? 'text-white'
                  : 'text-neutral-500 dark:text-neutral-400'
              } `}
            >
              Agregar tarea
            </Text>
          </TouchableOpacity>
        </View>
        <View className='w-1/2 flex items-center justify-center'>
          <Dropdown
            selectedValue={temporizador}
            onValueChange={setTemporizador}
            items={items}
            enabled={startDay === 0}
            colorScheme={colorScheme}
            buttonBackgroundColor={colorScheme === 'light' ? 'white' : '#222'}
            buttonTextColor={
              startDay === 0
                ? colorScheme === 'light'
                  ? 'black'
                  : 'white'
                : 'gray'
            }
            borderButtonColor={
              startDay === 0
                ? colorScheme === 'light'
                  ? 'gray'
                  : 'hsl(0, 0%, 70%)'
                : 'hsl(0, 0%, 50%)'
            }
            dropdownBorderColor={
              colorScheme === 'light' ? 'gray' : 'hsl(0, 0%, 70%)'
            }
          />
        </View>
      </View>
      <TaskList
        tasks={tasks.map((task) => ({
          ...task,
          startTime:
            task.startTime !== 'No especificado'
              ? new Date(task.startTime).toLocaleTimeString()
              : 'No especificado',
          endTime:
            task.endTime !== 'No especificado'
              ? new Date(task.endTime).toLocaleTimeString()
              : 'No especificado',
        }))}
        deleteTask={deleteTask}
      />
    </Layout>
  );
}
