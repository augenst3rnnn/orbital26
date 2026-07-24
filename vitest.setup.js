import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  cancelAllScheduledNotificationsAsync,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationHandler,
} from "expo-notifications";
import { vi } from "vitest";

vi.mock("react-native-reanimated", async () => {
  const Reanimated = await import("react-native-reanimated/mock");

  return Reanimated;
});

vi.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {
        SPOONACULAR_API_KEY: "test-key",
      },
    },
  },
}));

vi.mock("expo-notifications", () => ({
  setNotificationHandler: vi.fn(),
  scheduleNotificationAsync: vi.fn(),
  cancelAllScheduledNotificationsAsync: vi.fn(),
  addNotificationReceivedListener: vi.fn(() => ({ remove: vi.fn() })),
  addNotificationResponseReceivedListener: vi.fn(() => ({
    remove: vi.fn(),
  })),
  getPermissionsAsync: vi.fn(() => Promise.resolve({ status: "granted" })),
  requestPermissionsAsync: vi.fn(() => Promise.resolve({ status: "granted" })),
  getExpoPushTokenAsync: vi.fn(() => Promise.resolve({ data: "mock-token" })),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
}));

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: "View",
  SafeAreaView: "View",
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

vi.mock("expo-blur", () => ({
  BlurView: "View",
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  setItem: vi.fn(() => Promise.resolve()),
  getItem: vi.fn(() => Promise.resolve(null)),
  removeItem: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  getAllKeys: vi.fn(() => Promise.resolve([])),
}));
