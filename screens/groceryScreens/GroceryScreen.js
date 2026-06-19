import { useState } from "react";
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

const categories = ["All", "Produce", "Meat", "Dairy", "Pantry", "Beverages"];
const categoryMap = {
  Produce: "Produce",

  Meat: "Meat",

  "Milk, Eggs, Other Dairy": "Dairy",

  Baking: "Pantry",
  "Pasta and Rice": "Pantry",
  "Canned and Jarred": "Pantry",
  Condments: "Pantry",

  Beverages: "Beverages",
  "Tea and Coffee": "Beverages",
};

//later add function in spoonacularService? (fetch real API)
const mockIngredients = [
  { id: 1, name: "Eggs", category: "Dairy", quantity: "12 eggs" },
  { id: 2, name: "Tomato", category: "Produce", quantity: "3" },
  { id: 3, name: "Chicken Breast", category: "Meat", quantity: "500g" },
  { id: 4, name: "Milk", category: "Dairy", quantity: "1L" },
];

export default function GroceryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // check logic of this
  const inventoryCount = mockInventory.length;
  const missingCount = mockMissingIngredients.reduce(
    (total, recipe) => total + recipe.ingredients.length,
    0,
  );

  const groceryCount = mockGroceryList.length;

  const groceryCards = [
    {
      title: `You have ${inventoryCount} ingredients`,
      subtitle: "View your current inventory",
      image: require("../../assets/icons/purpleCart.png"),
      screen: "Inventory",
    },
    {
      title: "Missing for saved recipes",
      subtitle: "View your current inventory",
      image: require("../../assets/icons/yellowCart.png"),
      screen: "recipeMissingIngredients",
    },
    {
      title: "My grocery list",
      subtitle: `${groceryCount} items added`,
      image: require("../../assets/icons/checklist.png"),
      screen: "groceryList",
    },
  ];

  const filteredIngredients = mockIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-yellow-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-7 pt-8 pb-10">
          <Text className="text-3xl font-bold text-black">
            Smart Grocery List
          </Text>
          <Text className="text-gray-600 mr-20 mt-2">
            See what you have, what you need, and what to cook.
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-8">
          {/*search bar*/}
          <View className="bg-gray-100 rounded-full px-5 py-4 flex-row items-center mb-6 shadow">
            <Text className="text-gray-400 mr-3">🔍</Text>

            <TextInput
              placeholder="Add ingredients"
              placeholderTextColor={"gray"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-base mb-2 pl-2"
            />
          </View>

          {/*categories*/}
          <Text className="text-xl font-bold mb-4">Browse Categories</Text>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 18,
              paddingHorizontal: 3,
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                className="items-center"
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${selectedCategory === item ? "bg-purple-500" : "bg-gray-100"}`}
                >
                  //change this to icons
                  <Text className="text-2xl">{item}</Text>
                </View>

                <Text className="text-xs text-gray-600 mt-2 mb-5">{item}</Text>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
