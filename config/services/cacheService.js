import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCachedData(key, maxAge) {
  try {
    const cached = await AsyncStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);

    const age = Date.now() - parsed.timestamp;

    if (age > maxAge) {
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
}

//export async function setCachedData(key, data) {
