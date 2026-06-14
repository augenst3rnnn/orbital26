import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NutritionSection from '../components/NutritionSection';
import { getRecipeDetails } from "../config/hooks/spoonacularService";

export default function RecipeDetailsScreen({ route, navigation }) {
  const recipe = route.params.recipe;
  const [loading, setLoading] = useState(false);
  const [enrichedRecipe, setEnrichedRecipe] = useState(recipe);

  useEffect(() => {
    const fetchDetails = async () => {
      // Check if we need to fetch details (for API recipes, not mock ones)
      const needsIngredients = !recipe.extendedIngredients || recipe.extendedIngredients.length === 0;
      const needsInstructions = !recipe.instructions || 
        (recipe.instructions.length === 1 && recipe.instructions[0] === "Loading instructions...");
      
      if ((needsIngredients || needsInstructions) && recipe.id && recipe.id > 8) {
        setLoading(true);
        try {
          console.log("Fetching full details for recipe:", recipe.id);
          const details = await getRecipeDetails(recipe.id);
          console.log("Fetched:", {
            ingredients: details.extendedIngredients.length,
            instructions: details.instructions.length
          });
          
          setEnrichedRecipe({
            ...recipe,
            instructions: details.instructions,
            extendedIngredients: details.extendedIngredients.map(ing => ({ original: ing })),
            ingredients: details.extendedIngredients.length > 0 ? details.extendedIngredients : recipe.ingredients
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
    if (typeof currentRecipe.image === 'string') return { uri: currentRecipe.image };
    return currentRecipe.image;
  };

  const getCleanSummary = () => {
    if (!currentRecipe.summary) return "No description available.";
    return currentRecipe.summary.replace(/<[^>]*>/g, '');
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Recipe Image */}
      <Image source={getImageSource()} style={{ width: wp(100), height: hp(40) }} />

      {/* Content Container */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-3xl font-bold mb-2">{currentRecipe.title}</Text>
        
        {/* Time and Servings Row */}
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-full px-3 py-1 mr-2">
            <View className="flex-row items-center">
              <Image source={require("../assets/icons/timer.png")} style={{ width: 14, height: 14 }} />
              <Text className="text-sm ml-1">{currentRecipe.readyInMinutes || 20} minutes</Text>
            </View>
          </View>
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <View className="flex-row items-center">
              <Image source={require("../assets/icons/servings.png")} style={{ width: 14, height: 14 }} />
              <Text className="text-sm ml-1">{currentRecipe.servings || 2} servings</Text>
            </View>
          </View>
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
        ) : currentRecipe.extendedIngredients && currentRecipe.extendedIngredients.length > 0 ? (
          currentRecipe.extendedIngredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">• {ing.original}</Text>
          ))
        ) : currentRecipe.ingredients && currentRecipe.ingredients.length > 0 ? (
          currentRecipe.ingredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">• {ing}</Text>
          ))
        ) : (
          <Text className="text-gray-400">No ingredients listed</Text>
        )}

        {/* Instructions Section */}
        <Text className="text-lg font-semibold mb-2 mt-4">Instructions</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.instructions && currentRecipe.instructions.length > 0 ? (
          currentRecipe.instructions.map((step, idx) => (
            <Text key={idx} className="text-gray-600 py-1">{idx + 1}. {step}</Text>
          ))
        ) : (
          <Text className="text-gray-400">No instructions available</Text>
        )}
      </View>

      {/* Back Button */}
      <Pressable 
        className="absolute top-14 left-5 bg-white rounded-full p-2 shadow" 
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </Pressable>
    </ScrollView>
  );
}