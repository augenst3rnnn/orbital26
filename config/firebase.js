import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey:  "AIzaSyDbPxqprxL9kWzlxwxO-vzknEBxVQmmJto",
  authDomain: "cookedlah--login.firebaseapp.com",
  projectId: "cookedlah--login",
  storageBucket: "cookedlah--login.firebasestorage.app",
  messagingSenderId: "908873276141",
  appId: "1:908873276141:web:98739dda93c39029bb4ae4",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});