import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchRecipeNutrition } from '../config/hooks/spoonacularService';

const NutritionSection = ({ recipeId }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch nutrition data when component mounts or recipeId changes
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
    <>
        {/* Loading State */}
        {loading && (
            <View className="bg-white rounded-xl p-6 mx-4 my-2 items-center">
                <ActivityIndicator size="small" color="#eab308" />
                <Text className="text-gray-500 mt-2">Loading nutrition...</Text>
            </View>
        )}

        {/* Error State */}
        {error && !loading && (
            <View className="bg-white rounded-xl p-6 mx-4 my-2 items-center">
                <Text className="text-gray-400">⚠️ Nutrition info unavailable</Text>
            </View>
        )}

        {/*Display Nutrition Data */}
        {!loading && !error && nutrition && (
            <View className="bg-white rounded-xl mx-4 my-2 p-4">
                {/*Health Score Pill */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-semibold text-gray-800">📊 Nutrition Facts</Text>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getHealthColor(nutrition.healthScore) + '20' }}
                    >
                        <Text
                            className="text-sm font-medium"
                            style={{ color: getHealthColor(nutrition.healthScore) }}
                        >
                            {getHealthLabel(nutrition.healthScore)} ({Math.round(nutrition.healthScore)})
                        </Text>
                    </View>
                </View>

                {/* Calories Row*/}
                <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-100">
                    <Text className="text-base text-gray-600">🔥 Calories</Text>
                    <Text className="text-2xl font-bold">{Math.round(nutrition.calories)}</Text>
                </View>

                {/* Macronutrients Row*/}
                <View className="flex-row justify-between">
                    {/* Protein */}
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{Math.round(nutrition.protein)}g</Text>
                        <Text className="text-xs text-gray-500 mt-1">💪 Protein</Text>
                    </View>
                    {/* Carbs */}
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{Math.round(nutrition.carbs)}g</Text>
                        <Text className="text-xs text-gray-500 mt-1">🌾 Carbs</Text>
                    </View>
                    {/* Fat */}
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{Math.round(nutrition.fat)}g</Text>
                        <Text className="text-xs text-gray-500 mt-1">🥑 Fat</Text>
                    </View>
                    {/* Fiber */}
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{Math.round(nutrition.fiber)}g</Text>
                        <Text className="text-xs text-gray-500 mt-1">🌿 Fiber</Text>
                    </View>
                </View>
            </View>
        )}
    </>
);

export default NutritionSection;
