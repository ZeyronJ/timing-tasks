import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('general', {
      name: 'general',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'bell.wav',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      // agregar alerta para pedir permisos de batería
      alert(
        '¡Para recibir notificaciones en el tiempo programado, debes quitar restricciones de batería de la app!'
      );
    }
    if (finalStatus !== 'granted') {
      alert(
        '¡No se pudo obtener permiso para recibir notificaciones! Vuelve a abrir la app.'
      );
      return;
    } else {
      // console.log('Permisos de notificaciones concedidos');
    }
  } else {
    alert('Must use physical device for notifications');
  }
}

export async function schedulePushNotification(task) {
  const taskStartTime = new Date(task.startTime);
  const taskEndTime = new Date(task.endTime);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: task.title,
      body:
        'Inicio: ' +
        taskStartTime.toLocaleTimeString() +
        ' - Fin: ' +
        taskEndTime.toLocaleTimeString() +
        ' Descanso: ' +
        task.rest +
        ' minutos',
      data: { data: 'goes here' },
    },
    trigger: { date: taskStartTime, channelId: 'general' },
  });
}

export function scheduledTimeNotifications(tasks) {
  tasks.forEach((task) => {
    schedulePushNotification(task);
  });
}
