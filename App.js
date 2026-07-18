import React, { useEffect } from "react";
import { AppState } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { 
  setNotificationHandler, 
  createNotificationChannels,
  checkAndNotifyUnplannedMeals,
} from "./config/services/notificationsService";

export default function App() {
  useEffect(() => {
    setNotificationHandler();
    createNotificationChannels();
    
    // Check for unplanned meals when app launches
    setTimeout(() => {
      checkAndNotifyUnplannedMeals();  //check preferences internally
    }, 2000);

    // check when app returns to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App returned to foreground, checking meals...');
        setTimeout(() => {
          checkAndNotifyUnplannedMeals();  // checks preferences internally 
        }, 1000);
      }
    });

    return () => subscription.remove();
  }, []);

  return <AppNavigation />;
}