import { View, Text, Image, TouchableOpacity } from "react-native";

export default function RecipeCard({ recipe, onPress }) {
  const matchPercentage =
    recipe.usedIngredientCount > 0
      ? Math.round(
          (recipe.usedIngredientCount /
            (recipe.usedIngredientCount + recipe.missedIngredientCount)) *
            100,
        )
      : 0;

  return (
    <TouchableOpacity onPress={onPress} className="mb-4">
      <View className="bg-white rounded-lg overflow-hidden shadow-lg">
        <Image
          source={{ uri: recipe.image }}
          style={{ height: 200, width: "100%" }}
        />

        {/* Content */}
        <View className="p-4">
          {/* Title */}
          <Text className="text-lg font-bold mb-2 line-clamp-2">
            {recipe.title}
          </Text>

          {/* Match Percentage and likes */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-gray-600">
                Match: {matchPercentage}%
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                ({recipe.usedIngredientCount} of{" "}
                {recipe.usedIngredientCount + recipe.missedIngredientCount}{" "}
                ingredients)
              </Text>
            </View>

            <View className="items-center">
              <Image
                source={require("../assets/icons/heart.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text className="text-sm font-semibold">{recipe.likes}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
