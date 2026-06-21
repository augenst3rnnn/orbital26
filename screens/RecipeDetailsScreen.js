import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NutritionSection from "../components/NutritionSection";
import { getRecipeDetails } from "../config/services/spoonacularService";  // ← FIXED
import {
    getFavoriteRecipes,
    saveFavoriteRecipe,
    removeFavoriteRecipe
} from "../config/firestoreService";
import { auth } from "../config/firebase";

export default function RecipeDetailsScreen({ route, navigation }) {
  const recipe = route.params.recipe;
  const [loading, setLoading] = useState(false);
  const [enrichedRecipe, setEnrichedRecipe] = useState(recipe);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if recipe is already favorited
  useEffect(() => {
      checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
      try {
          const userId = auth.currentUser?.uid;
          if (!userId) return;
          
          const favorites = await getFavoriteRecipes(userId);
          const exists = favorites.some(fav => fav.id === recipe.id);
          setIsFavorite(exists);
      } catch (error) {
          console.error('Error checking favorite:', error);
      }
  };

  useEffect(() => {
    const fetchDetails = async () => {
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
          setDetailsFetched(true);
        } catch (error) {
          console.error("Error fetching details:", error);
          setDetailsFetched(true);
        } finally {
          setLoading(false);
        }
      } else {
        setDetailsFetched(true);
      }
    };

    fetchDetails();
  }, []);

  const currentRecipe = detailsFetched ? enrichedRecipe : recipe;
  const isLoading = loading && !detailsFetched;

  const getImageSource = () => {
    if (typeof currentRecipe.image === "string")
      return { uri: currentRecipe.image };
    return currentRecipe.image;
  };

  const getCleanSummary = () => {
    if (!currentRecipe.summary) return "No description available.";
    return currentRecipe.summary.replace(/<[^>]*>/g, "");
  };

  {/*handle favourite button*/}
  const handleToggleFavorite = async () => {
      try {
          const userId = auth.currentUser?.uid;
          if (!userId) {
              Alert.alert('Login Required', 'Please login to save favorites');
              return;
          }

          setFavoriteLoading(true);

          if (isFavorite) {
              await removeFavoriteRecipe(userId, currentRecipe.id);
              setIsFavorite(false);
              Alert.alert('Removed', 'Recipe removed from favorites');
          } else {
              await saveFavoriteRecipe(userId, currentRecipe.id, {
                  title: currentRecipe.title,
                  image: currentRecipe.image,
              });
              setIsFavorite(true);
              Alert.alert('Saved', 'Recipe added to favorites!');
          }
      } catch (error) {
          console.error('Error toggling favorite:', error);
          Alert.alert('Error', 'Failed to update favorites');
      } finally {
          setFavoriteLoading(false);
      }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Recipe Image */}
      <Image
        source={getImageSource()}
        style={{
          width: wp(100),
          height: hp(45),
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      />

      <View className="px-4 pt-4 bg-white">
        {/* Title and Favorite Button */}
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold flex-1">
            {currentRecipe.title}
          </Text>
          
          {/* Favorite Button */}
          <TouchableOpacity
          onPress={handleToggleFavorite}
          disabled={favoriteLoading}
          className="p-2"
          >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color="#eab308" />
            ) : (
            <Image source={
                isFavorite 
                    ? require("../assets/icons/heart.png") 
                    : require("../assets/icons/heart-unfilled.png")
            }
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          )}
          </TouchableOpacity>
        </View>

        {/* Time and Servings */}
        <View className="flex-row mt-2 mb-4">
          <View className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 mr-2 flex-row items-center">
            <Image
              source={require("../assets/icons/timer.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text className="text-gray-600 ml-1">
              {currentRecipe.readyInMinutes || 20} mins
            </Text>
          </View>
          <View className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 mr-2 flex-row items-center">
            <Image
              source={require("../assets/icons/servings.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text className="text-gray-600 ml-1">
              {currentRecipe.servings || 2} servings
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-lg font-semibold mb-2">Description</Text>
        <Text className="text-gray-600 mb-4">{getCleanSummary()}</Text>

        {/* Nutrition Section */}
        <NutritionSection recipeId={currentRecipe.id} />

        {/* Ingredients */}
        <Text className="text-lg font-semibold mb-2 mt-4">Ingredients</Text>
        {isLoading ? (
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

        {/* Instructions */}
        <Text className="text-lg font-semibold mb-2 mt-4">Instructions</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#eab308" />
        ) : currentRecipe.instructions &&
          currentRecipe.instructions.length > 0 ? (
          currentRecipe.instructions.map((step, idx) => (
            <Text key={idx} className="text-gray-600 py-1">
              {idx + 1}. {step}
            </Text>
          ))
        ) : (
          <Text className="text-gray-400 mb-4">No instructions available</Text>
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