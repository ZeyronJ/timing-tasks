import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { formatTimeFromDate } from '../../utils/timeUitls';

export default function createTask() {
  const [task, setTask] = useState({
    title: '',
    duration: null,
    rest: null,
    startTime: null,
    endTime: null,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [hourSelected, setHourSelected] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const db = SQLite.openDatabaseSync('tasks.db', {
    useNewConnection: true,
  });

  useEffect(() => {
    const isValid = task.title && task.duration !== null && task.rest !== null;
    setIsSaveEnabled(isValid);
  }, [task]);

  const onChange = (event, selectedTime) => {
    setShow(false);
    if (event.type === 'dismissed' || !selectedTime) return;
    setHourSelected(true);
    setTime(selectedTime);
    setTask({
      ...task,
      startTime: new Date(selectedTime),
      endTime: new Date(
        selectedTime.getTime() + (task.duration ? task.duration * 60000 : 0)
      ),
    });
  };

  const handleDurationChange = (text) => {
    const value = text === '' ? null : parseInt(text);
    setTask({ ...task, duration: value });
  };

  const handleRestChange = (text) => {
    const value = text === '' ? null : parseInt(text);
    setTask({ ...task, rest: value });
  };

  const createTask = async () => {
    try {
      if (!task.startTime) {
        await db.runAsync(
          `INSERT INTO tasks (title, duration, rest) values ('${task.title}', ${task.duration}, ${task.rest} )`
        );
      } else {
        await db.runAsync(
          `INSERT INTO tasks (title, duration, rest, startTime, endTime, fixed) values 
          ('${task.title}', ${task.duration}, ${
            task.rest
          }, '${task.startTime.toISOString()}', '${task.endTime.toISOString()}', 1 )`
        );
      }

      router.navigate('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {/* Primera fila */}
      <View className='flex flex-row mb-4'>
        <View className='w-1/2 flex flex-row justify-center'>
          <TextInput
            className='border-b border-b-neutral-400 self-start w-32 dark:text-white'
            placeholder='Titulo'
            selectionColor={colorScheme === 'light' ? 'black' : 'white'}
            placeholderTextColor={'gray'}
            onChangeText={(text) => setTask({ ...task, title: text })}
            value={task.title}
          />
        </View>
        <View className='w-1/2 flex flex-row items-center justify-center'>
          <Text className='mr-2 dark:text-white'>Duración:</Text>
          <TextInput
            className='border-b border-b-neutral-400'
            placeholder='Minutos'
            placeholderTextColor='gray'
            selectionColor={'black'}
            onChangeText={handleDurationChange}
            value={
              task.duration !== null && task.duration !== undefined
                ? task.duration.toString()
                : ''
            }
            keyboardType='numeric'
          />
        </View>
      </View>
      {/* Segunda fila */}
      <View className='flex flex-row mb-4'>
        <View className='w-1/2 flex flex-row justify-center items-center'>
          <Text className='dark:text-white'>Horario fijo?</Text>
          <Switch
            trackColor={{ false: 'hsl(0,0%,50%)', true: 'hsl(210,100%,85%)' }}
            thumbColor={isEnabled ? 'hsl(210,100%,50%)' : 'hsl(0,0%,85%)'}
            onValueChange={() => {
              setIsEnabled(!isEnabled);
              setTask({ ...task, startTime: null });
              setHourSelected(false);
            }}
            value={isEnabled}
          />
        </View>
        <View className='w-1/2 flex flex-row items-center justify-center'>
          <TouchableOpacity
            onPress={() => {
              setShow(true);
            }}
            className={`${
              isEnabled
                ? colorScheme == 'light'
                  ? 'bg-blue-500'
                  : 'bg-blue-600'
                : 'bg-neutral-200 dark:bg-neutral-700'
            } rounded px-3 py-2`}
            disabled={!isEnabled}
          >
            <Text
              className={`${
                isEnabled
                  ? 'text-white'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {hourSelected ? formatTimeFromDate(time) : 'Fijar hora'}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={time}
              mode='time'
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </View>
      </View>
      {/* Tercera fila */}
      <View className='flex flex-row mb-8'>
        <View className='w-full flex flex-row justify-center items-center'>
          <View className='w-1/2 flex flex-row items-center justify-center'>
            <Text className='mr-2 dark:text-white'>Descanso:</Text>
            <TextInput
              className='border-b border-b-neutral-400'
              placeholder='Minutos'
              placeholderTextColor='gray'
              selectionColor={'black'}
              onChangeText={handleRestChange}
              value={
                task.rest !== null && task.rest !== undefined
                  ? task.rest.toString()
                  : ''
              }
              keyboardType='numeric'
            />
          </View>
        </View>
      </View>
      {/* Botón de guardar */}
      <View className='w-full flex flex-row items-center justify-center'>
        <TouchableOpacity
          className={`py-2 px-4 rounded ${
            isSaveEnabled
              ? 'bg-green-500'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }`}
          onPress={createTask}
          disabled={!isSaveEnabled}
        >
          <Text
            className={`${
              isSaveEnabled
                ? 'text-white font-medium'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
