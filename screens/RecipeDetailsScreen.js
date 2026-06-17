import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NutritionSection from "../components/NutritionSection";
import { getRecipeDetails } from "../config/services/spoonacularService";

export default function RecipeDetailsScreen({ route, navigation }) {
  const recipe = route.params.recipe;
  const [loading, setLoading] = useState(false);
  const [enrichedRecipe, setEnrichedRecipe] = useState(recipe);

  useEffect(() => {
    const fetchDetails = async () => {
      // Check if we need to fetch details (for API recipes, not mock ones)
      const needsIngredients =
        !recipe.extendedIngredients || recipe.extendedIngredients.length === 0;
      const needsInstructions =
        !recipe.instructions ||
        (recipe.instructions.length === 1 &&
          recipe.instructions[0] === "Loading instructions...");

      if (
        (needsIngredients || needsInstructions) &&
        recipe.id &&
        recipe.id > 8
      ) {
        setLoading(true);
        try {
          console.log("Fetching full details for recipe:", recipe.id);
          const details = await getRecipeDetails(recipe.id);
          console.log("Fetched:", {
            ingredients: details.extendedIngredients.length,
            instructions: details.instructions.length,
          });

          setEnrichedRecipe({
            ...recipe,
            instructions: details.instructions,
            extendedIngredients: details.extendedIngredients.map((ing) => ({
              original: ing,
            })),
            ingredients:
              details.extendedIngredients.length > 0
                ? details.extendedIngredients
                : recipe.ingredients,
          });
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, []);

  const currentRecipe = loading ? recipe : enrichedRecipe;

  const getImageSource = () => {
    if (typeof currentRecipe.image === "string")
      return { uri: currentRecipe.image };
    return currentRecipe.image;
  };

  const getCleanSummary = () => {
    if (!currentRecipe.summary) return "No description available.";
    return currentRecipe.summary.replace(/<[^>]*>/g, "");
  };

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
            />{" "}
            {route.params.recipe.likes}
          </Text>
        </View>

        {/* Description */}
        <Text className="text-lg font-semibold mb-2">Description</Text>
        <Text className="text-gray-600 mb-4">{getCleanSummary()}</Text>

        {/* Nutrition Section */}
        <NutritionSection recipeId={currentRecipe.id} />

        {/* Ingredients Section */}
        <Text className="text-lg font-semibold mb-2 mt-4">Ingredients</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.extendedIngredients &&
          currentRecipe.extendedIngredients.length > 0 ? (
          currentRecipe.extendedIngredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">
              • {ing.original}
            </Text>
          ))
        ) : currentRecipe.ingredients &&
          currentRecipe.ingredients.length > 0 ? (
          currentRecipe.ingredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">
              • {ing}
            </Text>
          ))
        ) : (
          <Text className="text-gray-400">No ingredients listed</Text>
        )}

        {/* Instructions Section */}
        <Text className="text-lg font-semibold mb-2 mt-4">Instructions</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.instructions &&
          currentRecipe.instructions.length > 0 ? (
          currentRecipe.instructions.map((step, idx) => (
            <Text key={idx} className="text-gray-600 py-1">
              {idx + 1}. {step}
            </Text>
          ))
        ) : (
          <Text className="text-gray-400">No instructions available</Text>
        )}
      </View>

      {/* time and servings */}
      <View className="flex-row justify-start items-center -mt-2 ml-5">
        <View className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-2 mr-2">
          <Text className="text-gray-600">
            <Image
              source={require("../assets/icons/timer.png")}
              style={{ width: 20, height: 20 }}
            />{" "}
            {route.params.recipe.readyInMinutes} mins
          </Text>
        </View>
        <View className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-2 mr-2">
          <Text className="text-gray-600">
            <Image
              source={require("../assets/icons/servings.png")}
              style={{ width: 20, height: 20 }}
            />{" "}
            {route.params.recipe.servings} servings
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
