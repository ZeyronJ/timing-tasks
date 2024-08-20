import { Text, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import Dropdown from '../components/Dropdown';
import TaskList from '../components/TaskList';
import Layout from '../components/Layout';
import { router } from 'expo-router';
import { formatTimeFromSeconds } from '../utils/timeUitls';
import { useState, useEffect } from 'react';
import {
  openDatabase,
  saveSelectedPage,
  saveTemporizador,
} from '../utils/database';
import { itemsPages, itemsTemporizador } from '../utils/constants';

export default function Page() {
  const {
    tasks,
    handleStartDay,
    deleteTask,
    startDay,
    temporizador,
    setTemporizador,
    colorScheme,
    selectedPage,
    setSelectedPage,
  } = useTasks();

  // Agregar funciones para guardar estados de config, para esto se usan los sets de useConfig + funciones de DB
  const db = openDatabase();

  const configSelectedPage = (selectedPage) => {
    setSelectedPage(selectedPage);
    saveSelectedPage(db, selectedPage);
  };

  const configTemporizador = (temporizador) => {
    setTemporizador(temporizador);
    saveTemporizador(db, temporizador);
  };

  // const configStartDay = (startDay) => {
  //   setStartDay(startDay);
  //   saveStartDay(db, startDay);
  // }

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
              : // : startDay === 1
                // ? formatTimeFromSeconds(remainingTime)
                'Finalizar día'}
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
          Dentro de:
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
            onValueChange={configSelectedPage}
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
            onValueChange={configTemporizador}
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
