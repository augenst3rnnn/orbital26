import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NutritionSection from '../components/NutritionSection';

export default function RecipeDetailsScreen({ route, navigation }) {
  return (
    <ScrollView
      className="flex-1 bg-white rounded-lg p-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 2, paddingBottom: 100 }}
    >
      <View className="flex-row justify-center">
        <Image
          source={route.params.recipe.image}
          style={{
            width: wp(98),
            height: hp(45),
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: 1,
          }}
        />
      </View>

      {/* recipe content */}
      <View className="-mt-8 bg-white p-4 rounded-t-[50px]">
        {/* title and likes */}
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold flex-1 mt-2 ml-4">
            {route.params.recipe.title}
          </Text>
          <Text className="text-gray-500 font-bold mt-2 mr-5">
            <Image
                source={require("../assets/icons/heart.png")}
                style={{ width: 20, height: 14 }}
              /> {route.params.recipe.likes}
          </Text>
        </View>
      </View>

      {/* time and servings */}
      <View className="flex-row justify-start items-center -mt-2 ml-5">
        <View className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-2 mr-2">
          <Text className="text-gray-600">
            <Image source={require("../assets/icons/timer.png")}
              style={{ width: 20, height: 20 }}
            /> {route.params.recipe.readyInMinutes} mins
          </Text>
        </View>
        <View className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-2 mr-2">
          <Text className="text-gray-600">
            <Image source={require("../assets/icons/servings.png")}
              style={{ width: 20, height: 20 }}
            /> {route.params.recipe.servings} servings
          </Text>
        </View>
      </View>

      {/* description */}
      <Text className="text-xl font-bold mt-8 ml-5">Description</Text>
      <Text className="text-gray-700 mt-2 ml-5">
        {route.params.recipe.summary}
      </Text>

      {/* nutrition section */}
      <NutritionSection recipeId={route.params.recipe.id} />

      <View className="items-center my-5">
        <View className="my-3 border-b border-gray-300 w-64" />
      </View>

      {/* ingredients */}
      <View>
        <Text className="text-2xl font-bold mb-3 ml-5">Ingredients</Text>

        {route.params.recipe.ingredients.map((ingredient, index) => (
          <Text key={index} className="text-gray-700 mb-2 ml-5">
            • {ingredient}
          </Text>
        ))}
      </View>

      <View className="items-center my-5">
        <View className="my-3 border-b border-gray-300 w-64" />
      </View>

      {/* instructions */}
      <View>
        <Text className="text-2xl font-bold mb-3 ml-5">Instructions</Text>

        {route.params.recipe.instructions.map((instruction, index) => (
          <Text key={index} className="text-gray-700 mb-2 ml-5">
            {index + 1}. {instruction}
          </Text>
        ))}
      </View>

      {/*back button*/}
      <Pressable
        className="absolute top-14 left-5 bg-white rounded-full p-2 shadow"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </Pressable>
    </ScrollView>
  );
}
