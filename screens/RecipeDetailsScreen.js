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
      const needsDetails = (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) &&
                           (!recipe.instructions || recipe.instructions[0] === "Loading instructions...");
      
      if (needsDetails && recipe.id) {
        setLoading(true);
        try {
          const details = await getRecipeDetails(recipe.id);
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
      <Image source={getImageSource()} style={{ width: wp(100), height: hp(40) }} />

      <View className="p-4">
        <Text className="text-3xl font-bold mb-2">{currentRecipe.title}</Text>
        
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-full px-3 py-1 mr-2">
            <Text className="text-sm">{currentRecipe.readyInMinutes || 20} minutes
              <Image source={require("../assets/icons/timer.png")} style={{ width: 15, height: 15 }} />
            </Text>
          </View>
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-sm">{currentRecipe.servings || 2} servings 
              <Image source={require("../assets/icons/servings.png")} style={{ width: 15, height: 15 }} />
            </Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mb-2">Description</Text>
        <Text className="text-gray-600 mb-4">{getCleanSummary()}</Text>

        <NutritionSection recipeId={currentRecipe.id} />

        <Text className="text-lg font-semibold mb-2 mt-4">Ingredients</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.extendedIngredients?.length > 0 ? (
          currentRecipe.extendedIngredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">• {ing.original}</Text>
          ))
        ) : currentRecipe.ingredients?.length > 0 ? (
          currentRecipe.ingredients.map((ing, idx) => (
            <Text key={idx} className="text-gray-600 py-1">• {ing}</Text>
          ))
        ) : (
          <Text className="text-gray-400">No ingredients listed</Text>
        )}

        <Text className="text-lg font-semibold mb-2 mt-4">Instructions</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.instructions?.length > 0 ? (
          currentRecipe.instructions.map((step, idx) => (
            <Text key={idx} className="text-gray-600 py-1">{idx + 1}. {step}</Text>
          ))
        ) : (
          <Text className="text-gray-400">No instructions available</Text>
        )}
      </View>

      <Pressable className="absolute top-14 left-5 bg-white rounded-full p-2 shadow" onPress={() => navigation.goBack()}>
        <Text className="text-black text-xl">←</Text>
      </Pressable>
    </ScrollView>
  );
}