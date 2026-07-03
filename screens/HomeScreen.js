// screens/HomeScreen.js

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import useAuth from "../config/hooks/useAuth";
import { getUserProfile } from "../config/firestoreService";
import { useEffect, useState } from "react";
import { searchRecipesByIngredients } from "../config/services/spoonacularService";
import RecipeCard from "../components/RecipeCard";
import Categories from "../components/Categories";

export default function HomeScreen({ route, navigation }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState([]);

  // Meal planner params state
  const [plannerParams, setPlannerParams] = useState(null);

  // Get params from navigation (for meal planner)
  const returnToPlanner = route.params?.returnToPlanner;
  const plannerDate = route.params?.date;
  const plannerMealType = route.params?.mealType;
  const plannerOnSelect = route.params?.onSelect;

  // When params arrive, store them in state
  useEffect(() => {
    if (returnToPlanner) {
      console.log('🏠 HomeScreen: Received planner params!');
      setPlannerParams({
        returnToPlanner: true,
        date: plannerDate,
        mealType: plannerMealType,
        onSelect: plannerOnSelect
      });
      // Clear route params after storing
      navigation.setParams({
        returnToPlanner: undefined,
        date: undefined,
        mealType: undefined,
        onSelect: undefined
      });
    }
  }, [returnToPlanner]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (ingredients.length > 0) {
      setRecipeLoading(true);
      searchRecipesByIngredients(ingredients, selectedDietary)
        .then((data) => {
          setRecipes(data);
        })
        .catch((error) => {
          console.error("API Error: ", error);
          setRecipes([]);
        })
        .finally(() => setRecipeLoading(false));
    } else {
      setRecipes([]);
    }
  }, [ingredients, selectedDietary]);

  const fetchUserData = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserData(profile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const addIngredient = () => {
    if (!ingredient.trim()) return;
    if (ingredients.includes(ingredient.trim())) return;
    setIngredients([...ingredients, ingredient.trim()]);
    setIngredient("");
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Handle recipe selection for meal planner
  const handleRecipeSelect = (recipe) => {
    // Use stored params if available, otherwise use route params
    const params = plannerParams || {
      returnToPlanner: returnToPlanner,
      date: plannerDate,
      mealType: plannerMealType,
      onSelect: plannerOnSelect
    };

    if (params?.returnToPlanner) {
      console.log('🏠 HomeScreen: Navigating to RecipeDetails with planner params');
      navigation.navigate("RecipeDetails", {
        recipe: recipe,
        returnToPlanner: true,
        date: params.date,
        mealType: params.mealType,
        onSelect: params.onSelect,
      });
      // Clear after using
      setPlannerParams(null);
    } else {
      navigation.navigate("RecipeDetails", { recipe: recipe });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 300 }}
      >
        {/* Avatar and Bell Icon */}
        <View className="px-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../assets/icons/avatar.png")}
            style={{ height: 50, width: 50 }}
          />
          <Image
            source={require("../assets/icons/bell.png")}
            style={{ height: 30, width: 30 }}
          />
        </View>

        {/* Greetings */}
        <View className="mx-4 space-y-1 mb-4">
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Good morning {userData ? userData.displayName : "User"}!
          </Text>
          <Text
            style={{ fontSize: 30 }}
            className="font-semibold text-neutral-600"
          >
            What would you like to cook today?
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="Add ingredients"
            placeholderTextColor={"gray"}
            value={ingredient}
            onChangeText={setIngredient}
            onSubmitEditing={addIngredient}
            className="flex-1 text-base mb-2 pl-2"
            style={{ lineHeight: 24, height: 40 }}
          />
          <View className="bg-white rounded-full p-3">
            <Image
              source={require("../assets/icons/search.png")}
              style={{ height: 20, width: 20 }}
            />
          </View>
        </View>

        {/* Dietary Filters */}
        <Categories
          onSelectDietary={setSelectedDietary}
          selectedDietary={selectedDietary}
        />

        {/* Display Selected Ingredients */}
        {ingredients.length > 0 && (
          <View className="px-4 mt-4 mb-3">
            <Text className="font-bold mb-3">
              Your ingredients ({ingredients.length}):
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: "8" }}>
              {ingredients.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => removeIngredient(idx)}
                  className="bg-gray-100 px-2 py-2 rounded-full"
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text className="text-gray-800">{item}</Text>
                  <Text className="text-red-500 font-bold ml-2">✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Loading State */}
        {recipeLoading && (
          <Text className="px-4 text-gray-500">Finding recipes...</Text>
        )}

        {/* Display Recipes */}
        {recipes.length > 0 && (
          <View className="px-4">
            <Text className="font-bold text-lg mb-4">
              Recipes for you ({recipes.length}):
            </Text>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => handleRecipeSelect(recipe)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}