import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockRecipes } from "../../data/mockRecipes";
import { useDebounce } from "../../config/hooks/useDebounce";
import { mockInventory } from "../../data/mockInventory";
import { mockMissingIngredients } from "../../data/mockMissingIngredients";
import { mockGroceryList } from "../../data/mockGroceryList";
import EditIngredientModal from "../../components/EditIngredientModal";

export default function MissingIngredientsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-10 pt-28 pb-20">
        <View className="translate-y-6">
          <Text className="text-xl font-bold text-black">
            Missing for recipes
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10">
        {/*search bar*/}
        <View className="bg-gray-100 rounded-full px-5 py-4 flex-row items-center mb-6 shadow">
          <Text className="text-gray-400 mr-3">🔍</Text>

          <TextInput
            placeholder="Search recipes"
            placeholderTextColor={"gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base mb-2 pl-2"
          />
        </View>

        {/*body*/}
        <ScrollView>
          <Text className="text-lg font-semibold pl-2 pb-4">
            From your saved recipes
          </Text>

          <View className="gap-4 p-2">
            {mockMissingIngredients.map((recipe) => {
              return (
                <View
                  key={recipe.recipeId}
                  className="border-[1px] border-gray-300 bg-gray-50 rounded-lg shadow-lg pt-2 pb-4 px-2"
                >
                  <Text className="text-xl font-bold px-2 pt-1 pb-3">
                    {recipe.recipeName}
                  </Text>
                  <View className="rounded-full p-2 bg-purple-200 w-20 items-center ml-2 mb-2">
                    <Text className="text-[10px] text-purple-800">
                      {recipe.ingredients.length} missing
                    </Text>
                  </View>

                  {/*missing ingredients for 1 recipe*/}
                  {recipe.ingredients.map((ingredient) => (
                    <View
                      key={ingredient.id}
                      className="flex-row items-center justify-between gap-2 mb-2"
                    >
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity>
                          <View className="w-5 h-5 rounded-full border border-gray-400" />
                        </TouchableOpacity>
                        <Text className="font-sm">{ingredient.name}</Text>
                      </View>

                      <Text className="font-xs text-gray-700 mr-4 pt-3">
                        {ingredient.amount} {ingredient.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/*back button*/}
      <TouchableOpacity
        className="absolute top-14 left-5 bg-white rounded-full p-2 shadow"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </TouchableOpacity>
    </View>
  );
}
