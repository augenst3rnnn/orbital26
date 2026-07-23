import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import RecipeModal from "./RecipeModal";

export default function RecipeCard({ recipe }) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const matchPercentage =
    recipe.usedIngredientCount > 0
      ? Math.round(
          (recipe.usedIngredientCount /
            (recipe.usedIngredientCount + recipe.missedIngredientCount)) *
            100,
        )
      : 0;

  //format recipe to work with both API and mock formats
  const formattedRecipe = {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    summary:
      recipe.summary ||
      `${recipe.title} - A delicious recipe made with your ingredients.`,
    usedIngredientCount: recipe.usedIngredientCount || 0,
    missedIngredientCount: recipe.missedIngredientCount || 0,
    readyInMinutes: recipe.readyInMinutes || 20,
    servings: recipe.servings || 2,
    likes: recipe.likes || 0,
    ingredients:
      recipe.usedIngredients?.map((i) => i.name) || recipe.ingredients || [],
    instructions: recipe.instructions || ["Loading instructions..."],
    extendedIngredients:
      recipe.extendedIngredients ||
      recipe.usedIngredients?.map((i) => ({
        original: i.name,
      })) ||
      [],
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} className="mb-10">
        <View className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-purple-300">
          <View className="border-8 border-white pt-2 px-2">
            <Image
              source={{ uri: recipe.image }}
              className="w-full h-44 border-2 border-yellow-400"
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="text-lg font-bold mb-2">{recipe.title}</Text>
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
                  <Text className="text-sm font-semibold">
                    {recipe.likes || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <RecipeModal
        visible={modalVisible}
        recipe={formattedRecipe}
        onClose={() => setModalVisible(false)}
        onReadMore={() => {
          setModalVisible(false);
          navigation.navigate("RecipeDetails", { recipe: formattedRecipe });
        }}
      />
    </>
  );
}
