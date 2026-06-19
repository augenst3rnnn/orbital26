import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

{
  /*placeholder first*/
}
export default function InventoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-semibold text-gray-800">
          Ingredient Inventory
        </Text>
      </View>
    </SafeAreaView>
  );
}
