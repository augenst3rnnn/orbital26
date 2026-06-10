import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

{
  /*placeholder first*/
}

export default function RecipeDetailsScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-semibold text-gray-800">
          Recipe Details
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-4 bg-yellow-300 px-4 py-2 rounded-lg"
        >
          <Text className="text-gray-800 font-semibold">
            Return to Explore Page
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
