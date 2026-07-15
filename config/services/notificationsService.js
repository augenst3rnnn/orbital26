import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';
import { setNotificationPreferences } from '../config/firestoreService';

//request permissions and register for push notifications
export const registerForPushNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // save token to Firestore
    const userId = auth.currentUser?.uid;
    if (userId && token) {
      await setNotificationPreferences(userId, { pushToken: token });
    }
    
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

// create notification channels for Android
export const createNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('meal-reminders', {
      name: 'Meal Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('grocery-alerts', {
      name: 'Grocery Alerts',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('recipe-suggestions', {
      name: 'Recipe Suggestions',
      importance: Notifications.AndroidImportance.LOW,
      sound: 'default',
    });
  }
};

// send a test notification
export const sendTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Notification Test',
      body: 'Your notifications are working!',
    },
    trigger: null, // send immediately
  });
};

// set notification handler (foreground)
export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};