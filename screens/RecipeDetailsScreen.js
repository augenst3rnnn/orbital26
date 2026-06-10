import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailsScreen({ route, navigation }) {
  return (
    //fix this UI
    <ScrollView
      className="flex-1 bg-white rounded-lg"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 2 }}
    >
      <View className="p-1">
        <Image
          source={route.params.recipe.image}
          className="w-full h-[400px] rounded-t-3xl"
          resizeMode="cover"
        />
      </View>

      {/*back button*/}
      <Pressable
        className="absolute top-10 left-5 bg-white rounded-full p-2 shadow"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </Pressable>
    </ScrollView>
  );
}
