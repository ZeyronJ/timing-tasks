import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { openDatabase, saveScheme } from '../utils/database';

export default function HomeLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'light' ? '#fff' : '#333',
        },
        headerTintColor: colorScheme === 'light' ? '#000' : '#fff',
        headerTitleStyle: {
          fontWeight: 'semibold',
        },
        animation: 'fade_from_bottom',
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              const db = openDatabase();
              toggleColorScheme();
              console.log(colorScheme === 'light' ? 'dark' : 'light');
              saveScheme(db, colorScheme === 'light' ? 'dark' : 'light');
            }}
          >
            {colorScheme === 'light' ? (
              <Ionicons name='moon' size={24} color='black' />
            ) : (
              <Ionicons name='sunny' size={24} color='white' />
            )}
          </TouchableOpacity>
        ),
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name='index' options={{ title: 'Tareas a tiempo' }} />
      <Stack.Screen
        name='tasks/createTask'
        options={{ title: 'Crear tarea' }}
      />
    </Stack>
  );
}
