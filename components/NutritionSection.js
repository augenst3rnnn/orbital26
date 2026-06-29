import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchRecipeNutrition } from "../config/services/spoonacularService";

const NutritionSection = ({ recipeId }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHealthColor = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#eab308";
    return "#ef4444";
  };

  const getHealthLabel = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 40) return "Good";
    return "Needs Improvement";
  };

  useEffect(() => {
    const loadNutrition = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipeNutrition(recipeId);
        setNutrition(data);
        setError(null);
      } catch (err) {
        console.error("Nutrition fetch error:", err);
        setError("Could not load nutrition info");
      } finally {
        setLoading(false);
      }
    };

    loadNutrition();
  }, [recipeId]);

  return (
    <View className="mx-4 my-3">
      {/* Loading State */}
      {loading && (
        <View className="bg-white rounded-2xl p-6 items-center shadow-sm border border-gray-100">
          <ActivityIndicator size="small" color="#eab308" />
          <Text className="text-gray-500 mt-2 font-medium">
            Loading nutrition...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View className="bg-white rounded-2xl p-6 items-center shadow-sm border border-gray-100">
          <Text className="text-gray-400">Nutrition info unavailable</Text>
        </View>
      )}

      {/* Display Nutrition Data */}
      {!loading && !error && nutrition && (
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="p-4 bg-gray-50 border-b border-gray-100">
            <View className="flex-row items-center gap-2">
              <Image
                source={require("../assets/icons/nutritionfacts.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text className="text-base font-semibold text-gray-800">
                Nutrition Facts
              </Text>
            </View>
          </View>

          {/* Health Score Pill */}
          <View className="items-center py-3 bg-white border-b border-gray-100">
            <View
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: getHealthColor(nutrition.healthScore) + "20",
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: getHealthColor(nutrition.healthScore) }}
              >
                {getHealthLabel(nutrition.healthScore)} •{" "}
                {Math.round(nutrition.healthScore)}/100
              </Text>
            </View>
          </View>

          {/* Calories */}
          <View className="items-center py-7 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-center w-full mb-1">
              <Text className="text-sm text-gray-500">Energy</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-800">
              {Math.round(nutrition.calories)}
            </Text>
            <Text className="text-sm text-gray-500">calories per serving</Text>
          </View>

          {/*Macronutrients*/}
          <View className="p-4 bg-gray-50">
            <Text className="text-xs text-gray-500 mb-3 font-semibold tracking-wider">
              MACRONUTRIENTS
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {/* Protein Card */}
              <View className="w-[48%] bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Image
                    source={require("../assets/icons/protein.png")}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                  <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-semibold text-blue-700">
                      Protein
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-blue-700">
                  {Math.round(nutrition.protein)}
                  <Text className="text-sm font-normal text-blue-500">g</Text>
                </Text>
                <Text className="text-xs text-blue-600 mt-2">
                  Builds muscle & repairs tissue
                </Text>
              </View>

              {/* Carbs Card */}
              <View className="w-[48%] bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Image
                    source={require("../assets/icons/carbs.png")}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                  <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-semibold text-orange-700">
                      Carbs
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-orange-700">
                  {Math.round(nutrition.carbs)}
                  <Text className="text-sm font-normal text-orange-500">g</Text>
                </Text>
                <Text className="text-xs text-orange-600 mt-2">
                  Primary energy source
                </Text>
              </View>

              {/* Fat Card */}
              <View className="w-[48%] bg-green-50 rounded-xl p-3 mb-3 border border-green-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Image
                    source={require("../assets/icons/fat.png")}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                  <View className="bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-semibold text-green-700">
                      Fats
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-green-700">
                  {Math.round(nutrition.fat)}
                  <Text className="text-sm font-normal text-green-500">g</Text>
                </Text>
                <Text className="text-xs text-green-600 mt-2">
                  Essential for hormone function
                </Text>
              </View>

              {/* Fiber Card */}
              <View className="w-[48%] bg-purple-50 rounded-xl p-3 mb-3 border border-purple-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Image
                    source={require("../assets/icons/fiber.png")}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                  <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-semibold text-purple-700">
                      Fiber
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-purple-700">
                  {Math.round(nutrition.fiber)}
                  <Text className="text-sm font-normal text-purple-500">g</Text>
                </Text>
                <Text className="text-xs text-purple-600 mt-2">
                  Supports digestive health
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default NutritionSection;
