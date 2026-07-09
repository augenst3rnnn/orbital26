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
import { getRecipeDetails } from "../config/services/spoonacularService";
import {
  getFavoriteRecipes,
  saveFavoriteRecipe,
  removeFavoriteRecipe,
  saveMealForDay,
} from "../config/firestoreService";
import { auth } from "../config/firebase";
import { mockRecipes } from "../data/mockRecipes";

export default function RecipeDetailsScreen({ route, navigation }) {
  const recipe = route.params.recipe;
  const [loading, setLoading] = useState(false);
  const [enrichedRecipe, setEnrichedRecipe] = useState(recipe);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showMealPlannerOptions, setShowMealPlannerOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const favorites = await getFavoriteRecipes(userId);
      const exists = favorites.some((fav) => fav.id === recipe.id);
      setIsFavorite(exists);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchDetails = async () => {
      //check if the recipe is a mock recipe with full data from firestore
      if (
        recipe.id <= 8 &&
        recipe.ingredients &&
        recipe.ingredients.length > 0
      ) {
        setEnrichedRecipe({
          ...recipe,
          extendedIngredients: recipe.ingredients.map((ing) => ({
            original: ing,
          })),
        });
        setDetailsFetched(true);
        return;
      }

      // fallback: if mock recipe but missing data, use mockRecipes file
      if (recipe.id <= 8) {
        const mockRecipe = mockRecipes.find((r) => r.id === recipe.id);
        if (mockRecipe) {
          setEnrichedRecipe({
            ...recipe,
            ingredients: mockRecipe.ingredients,
            instructions: mockRecipe.instructions,
            summary: mockRecipe.summary || recipe.summary,
            readyInMinutes: mockRecipe.readyInMinutes || recipe.readyInMinutes,
            servings: mockRecipe.servings || recipe.servings,
            extendedIngredients: mockRecipe.ingredients.map((ing) => ({
              original: ing,
            })),
          });
          setDetailsFetched(true);
          return;
        }
      }

      const needsIngredients =
        !recipe.extendedIngredients || recipe.extendedIngredients.length === 0;
      const needsInstructions =
        !recipe.instructions ||
        (recipe.instructions.length === 1 &&
          recipe.instructions[0] === "Loading instructions...");

      if ((needsIngredients || needsInstructions) && recipe.id && recipe.id > 8) {
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
              original: ing.original,
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

  const handleToggleFavorite = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Login Required", "Please login to save favorites");
        return;
      }

      setFavoriteLoading(true);

      const isMockRecipe = currentRecipe?.id && currentRecipe.id <= 8;

      if (isFavorite) {
        await removeFavoriteRecipe(userId, currentRecipe.id);
        setIsFavorite(false);
        Alert.alert("Removed", "Recipe removed from favorites");
      } else {
        await saveFavoriteRecipe(userId, currentRecipe.id, {
          id: currentRecipe.id,
          title: currentRecipe.title,
          image: currentRecipe.image,
          // full data for mock recipes
          summary: isMockRecipe ? currentRecipe.summary || "" : "",
          ingredients: isMockRecipe ? currentRecipe.ingredients || [] : [],
          instructions: isMockRecipe ? currentRecipe.instructions || [] : [],
          readyInMinutes: isMockRecipe ? currentRecipe.readyInMinutes || 20 : 20,
          servings: isMockRecipe ? currentRecipe.servings || 2 : 2,
          likes: isMockRecipe ? currentRecipe.likes || 0 : 0,
          isMock: isMockRecipe,
          savedAt: new Date().toISOString(),
        });
        setIsFavorite(true);
        Alert.alert("Saved", "Recipe added to favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  // handle adding to meal plan
  const handleAddToMealPlan = (mealType) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Login Required", "Please login to save to meal plan");
      return;
    }

    const mealRecipe = {
      id: currentRecipe.id,
      title: currentRecipe.title,
      image: currentRecipe.image,
      calories: currentRecipe.calories || 0,
      summary: currentRecipe.summary || "",
      ingredients: currentRecipe.ingredients || [],
      instructions: currentRecipe.instructions || [],
      readyInMinutes: currentRecipe.readyInMinutes || 20,
      servings: currentRecipe.servings || 2,
      extendedIngredients: currentRecipe.extendedIngredients || [],
    };

    saveMealForDay(userId, selectedDate, mealType.toLowerCase(), mealRecipe)
      .then(() => {
        Alert.alert("Success", `Added to ${mealType} on ${formatDate(selectedDate)}!`);
        setShowMealPlannerOptions(false);
      })
      .catch((error) => {
        console.error("Error adding to meal plan:", error);
        Alert.alert("Error", "Failed to add to meal plan");
      });

      const isMockRecipe = currentRecipe?.id && currentRecipe.id <= 8;

      if (isFavorite) {
        await removeFavoriteRecipe(userId, currentRecipe.id);
        setIsFavorite(false);
        Alert.alert("Removed", "Recipe removed from favorites");
      } else {
        const recipeDetails = await getRecipeDetails(currentRecipe.id);

        await saveFavoriteRecipe(userId, currentRecipe.id, {
          id: currentRecipe.id,
          title: currentRecipe.title,
          image: currentRecipe.image,
          summary: recipeDetails.summary || currentRecipe.summary || "",
          ingredients: recipeDetails.extendedIngredients || [],
          instructions: recipeDetails.instructions || [],
          readyInMinutes:
            recipeDetails.readyInMinutes || currentRecipe.readyInMinutes || 20,
          servings: recipeDetails.servings || currentRecipe.servings || 2,
          likes: currentRecipe.likes || 0,

          isMock: isMockRecipe,
          savedAt: new Date().toISOString(),
        });
        setIsFavorite(true);
        Alert.alert("Saved", "Recipe added to favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites");
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
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold flex-1">
            {currentRecipe.title}
          </Text>

          <TouchableOpacity
            onPress={handleToggleFavorite}
            disabled={favoriteLoading}
            className="p-2"
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color="#eab308" />
            ) : (
              <Image
                source={
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

        <Text className="text-lg font-semibold mb-2">Description</Text>
        <Text className="text-gray-600 mb-4">{getCleanSummary()}</Text>

        <NutritionSection recipeId={currentRecipe.id} />

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

        {/* add to meal plan button */}
        <View className="mt-6 mb-2">
          {!showMealPlannerOptions ? (
            <TouchableOpacity
              className="bg-yellow-300 py-3 rounded-xl mr-10 ml-10"
              onPress={() => setShowMealPlannerOptions(true)}
            >
              <Text className="text-center font-semibold text-gray-600">
                Add to Meal Plan
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-gray-50 rounded-xl p-4">
              {/* date selection with calendar strip */}
              <View className="mb-3">
                <Text className="text-sm font-semibold text-gray-600 mb-2 text-center">
                  Select date
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="px-1"
                >
                  <View className="flex-row">
                    {[0, 1, 2, 3, 4, 5, 6].map((days) => {
                      const date = new Date();
                      date.setDate(date.getDate() + days);
                      const dateStr = date.toISOString().split("T")[0];
                      const isSelected = dateStr === selectedDate;
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      const dayNum = date.getDate();
                      const isToday = days === 0;

                      return (
                        <TouchableOpacity
                          key={days}
                          onPress={() => setSelectedDate(dateStr)}
                          className={`items-center px-4 py-3 mx-1 rounded-xl min-w-[65px] ${
                            isSelected
                              ? "bg-yellow-300 shadow"
                              : isToday
                              ? "bg-yellow-50 border-2 border-yellow-300"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              isSelected ? "text-gray-800" : "text-gray-500"
                            }`}
                          >
                            {dayName}
                          </Text>
                          <Text
                            className={`text-2xl font-bold ${
                              isSelected ? "text-gray-800" : "text-gray-700"
                            }`}
                          >
                            {dayNum}
                          </Text>
                          {isToday && (
                            <View className="mt-1 px-1.5 py-1 bg-yellow-400 rounded-full">
                              <Text className="text-[8px] font-bold text-gray-800">
                                TODAY
                              </Text>
                            </View>
                          )}
                          {isSelected && !isToday && (
                            <View className="mt-1 px-1.5 py-1 bg-yellow-400 rounded-full">
                              <Text className="text-[8px] font-bold text-gray-800">
                                SELECTED
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <Text className="text-sm font-semibold text-gray-600 mb-2 text-center">
                Add to {formatDate(selectedDate)}
              </Text>

              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="flex-1 py-2.5 rounded-xl bg-yellow-300"
                  onPress={() => handleAddToMealPlan("Breakfast")}
                >
                  <Text className="text-center font-medium">Breakfast</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-2.5 rounded-xl bg-yellow-300"
                  onPress={() => handleAddToMealPlan("Lunch")}
                >
                  <Text className="text-center font-medium">Lunch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-2.5 rounded-xl bg-yellow-300"
                  onPress={() => handleAddToMealPlan("Dinner")}
                >
                  <Text className="text-center font-medium">Dinner</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="mt-2 py-1"
                onPress={() => setShowMealPlannerOptions(false)}
              >
                <Text className="text-center text-gray-700 text-sm border-gray-300 rounded-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Pressable
        className="absolute top-14 left-5 bg-white rounded-full p-2 shadow"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </Pressable>
    </ScrollView>
  );
}
