import { Text, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import Dropdown from '../components/Dropdown';
import TaskList from '../components/TaskList';
import Layout from '../components/Layout';
import { useColorScheme } from 'nativewind';
import { router, useFocusEffect } from 'expo-router';
import { formatTimeFromSeconds } from '../utils/timeUitls';
import { useState, useEffect, useCallback } from 'react';

const itemsTemporizador = [
  { label: '0 minutos', value: 0 },
  { label: '1 minuto', value: 1 },
  { label: '2 minutos', value: 2 },
  { label: '5 minutos', value: 5 },
  { label: '10 minutos', value: 10 },
  { label: '15 minutos', value: 15 },
  { label: '30 minutos', value: 30 },
  { label: '60 minutos', value: 60 },
];

const itemsPages = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
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
    colorScheme,
    selectedPage,
    setSelectedPage,
  } = useTasks();
  // const [selectedPage, setSelectedPage] = useState(1);
  const [visibleTasks, setVisibleTasks] = useState([]);
  // const { colorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    setVisibleTasks(tasks.filter((task) => task.page === selectedPage));
    console.log(selectedPage, temporizador, colorScheme, startDay);
  }, [selectedPage, tasks]);
  // useFocusEffect(
  //   useCallback(() => {
  //     // console.log('focusEffect');
  //     // console.log('config', config);
  //     // setSelectedPage(config.selectedPage);
  //     // setTemporizador(config.temporizador);
  //     // setStartDay(config.startDay);
  //     // if (colorScheme !== config.colorScheme) {
  //     //   toggleColorScheme();
  //     // }
  //   }, [])
  // );
  return (
    <Layout>
      {/* Botón principal Iniciar dia */}
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
      {/* Texto Temporizador */}
      <View className='flex flex-row'>
        <Text className='w-1/3'></Text>
        <Text
          className={`w-1/3 text-center ${
            startDay === 0
              ? 'dark:text-white'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Pagina:
        </Text>
        <Text
          className={`w-1/3 text-center ${
            startDay === 0
              ? 'dark:text-white'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Temporizador:
        </Text>
      </View>
      {/* Botones Agregar tarea y Temporizador */}
      <View className='flex flex-row mb-2'>
        <View className='w-1/3 flex items-center justify-center'>
          <TouchableOpacity
            onPress={() =>
              router.navigate({
                pathname: 'tasks/createTask',
                params: { selectedPage },
              })
            }
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
        <View className='w-1/3 flex items-center justify-center'>
          <Dropdown
            selectedValue={selectedPage}
            onValueChange={setSelectedPage}
            items={itemsPages}
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
        <View className='w-1/3 flex items-center justify-center'>
          <Dropdown
            selectedValue={temporizador}
            onValueChange={setTemporizador}
            items={itemsTemporizador}
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
      {/* Lista de tareas */}
      <TaskList
        tasks={visibleTasks.map((task) => ({
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
