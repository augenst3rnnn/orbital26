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

export default function FullIngredientsScreen({ navigation, route }) {
  const { recipe } = route.params;
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const ingredients = recipe.extendedIngredients || recipe.ingredients || [];

  const ingredientCount = ingredients.length;
  const missingCount = recipe.missingIngredients?.length || 0;
  const haveCount = ingredientCount - missingCount;

  const progress = ingredientCount > 0 ? haveCount / ingredientCount : 0;

  const renderIngredient = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex-row items-center py-3"
        onPress={() => setSelectedIngredient(item)}
      >
        {/*temporary checklist circle*/}
        <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
        <Text className="flex-1 text-base text-black">
          {item.name || item.originalName}
        </Text>

        <Text className="text-gray-600">
          {item.amount} {item.unit}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-10 pt-28 pb-20">
        <View className="translate-y-6">
          <Text className="text-xl font-bold text-black">
            Recipes & Ingredients
          </Text>
        </View>
      </View>

      {/*white body*/}
      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10">
        <Text className="text-gray-600 pl-2 pt-1 pb-4">
          Check off ingredients as you get them!
        </Text>

        {/*recipe card*/}
        <View className="flex-1 border border-gray-300 rounded-[25px] overflow-hidden">
          <View className="flex-row border-b border-gray-300">
            <Image
              source={{ uri: recipe.image }}
              className="w-28 h-28"
              resizeMode="cover"
            />

            <View className="flex-1 px-4 py-3 justify-center">
              <Text className="text-lg font-bold text-black">
                {recipe.title}
              </Text>

              <Text className="text-sm text-gray-600 mt-1">
                {haveCount} of {ingredientCount} ingredients
              </Text>

              <View className="h-3 bg-purple-100 rounded-full mt-2 overflow-hidden">
                <View
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/*ingredient list*/}
          <FlatList
            data={ingredients}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) =>
              String(item.id || `${item.name}-${index}`)
            }
            renderItem={renderIngredient}
            contentContainerStyle={{
              paddingHorizontal: 28,
              paddingVertical: 22,
            }}
          />
        </View>
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
