import AsyncStorage from "@react-native-async-storage/async-storage";

const twentyFourHours = 24 * 60 * 60 * 1000;

export async function getCachedData(key) {
  try {
    const cached = await AsyncStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);

    const age = Date.now() - parsed.timestamp;

    if (age > twentyFourHours) {
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
}

export async function setCachedData(key, data) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (error) {
    console.error("Cache write error:", error);
  }
}
