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
import { mockGroceryIngredients } from "../../data/mockGroceryList";

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
      image: require("../assets/icons/purpleCart.png"),
    },
  ];
}
