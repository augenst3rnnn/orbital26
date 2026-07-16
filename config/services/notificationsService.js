import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { auth } from '../firebase';
import { 
  setNotificationPreferences, 
  getMealPlanForWeek,
  getNotificationPreferences
} from '../firestoreService';
import { getWeekStart, getWeekDates, formatDateDisplay } from './dateUtils';

// set notification handler (for foreground notifications)
export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// create notification channels for Android
export const createNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    try {
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
    } catch (error) {
      console.log('Channels already exist or not supported:', error);
    }
  }
};

// schedule a local notification
export const scheduleLocalNotification = async (title, body, delaySeconds = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
      },
    });
    console.log('Local notification scheduled');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// show an immediate in-app alert
export const showInAppNotification = (title, message) => {
  Alert.alert(title, message);
};

// test function
export const testLocalNotification = async () => {
  await scheduleLocalNotification(
    'Notification Test',
    'Your local notifications are working in Expo Go!',
    2
  );
};

// cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Check for unplanned meals
export const checkAndNotifyUnplannedMeals = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('User not logged in, skipping meal check');
      return;
    }

    // check if user has meal reminders enabled
    const preferences = await getNotificationPreferences(userId);
    console.log('📱 Notification preferences:', JSON.stringify(preferences, null, 2));
    
    if (!preferences || !preferences.mealReminders) {
      console.log('Meal reminders are disabled, skipping notifications');
      return;
    }

    console.log('Meal reminders enabled, checking meals...');

    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart(today);
    const weekDates = getWeekDates(weekStart);
    
    const mealPlan = await getMealPlanForWeek(userId, weekStart);
    
    const daysToCheck = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      daysToCheck.push(date.toISOString().split('T')[0]);
    }

    let notificationsSent = 0;

    for (let i = 0; i < daysToCheck.length; i++) {
      const date = daysToCheck[i];
      const dayPlan = mealPlan[date] || { breakfast: null, lunch: null, dinner: null };
      
      const missingMeals = [];
      if (!dayPlan.breakfast) missingMeals.push('Breakfast');
      if (!dayPlan.lunch) missingMeals.push('Lunch');
      if (!dayPlan.dinner) missingMeals.push('Dinner');

      if (missingMeals.length > 0) {
        const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDateDisplay(date);
        const mealList = missingMeals.join(', ');
        
        await scheduleLocalNotification(
          'Meal Plan Reminder',
          `${dayLabel}: You haven't planned ${mealList}. Tap to add meals now!`,
          1
        );
        notificationsSent++;
      }
    }

    if (notificationsSent > 0) {
      console.log(`Sent ${notificationsSent} meal reminder notifications`);
    } else {
      console.log('All meals planned for the next 3 days!');
    }

  } catch (error) {
    console.error('Error checking unplanned meals:', error);
  }
};