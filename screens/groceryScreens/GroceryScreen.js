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
import {
  getCurrentUserId,
  getIngredientInventory,
  getFavoriteRecipes,
} from "../../config/firestoreService";

const categories = [
  { name: "Produce", image: require("../../assets/icons/produce.png") },
  { name: "Meat", image: require("../../assets/icons/meat.png") },
  { name: "Dairy", image: require("../../assets/icons/dairy.png") },
  { name: "Pantry", image: require("../../assets/icons/pantry.png") },
  { name: "Beverages", image: require("../../assets/icons/beverages.png") },
];

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

const userId = getCurrentUserId();

const getMissingIngredientsForRecipe = (recipeIngredients, inventory) => {
  return recipeIngredients.filter((recipeIng) => {
    const ownedIng = inventory.find(
      (invIng) => invIng.id === recipeIng.id || invIng.name === recipeIng.name,
    );

    //user does not own ingredient at all
    if (!ownedIng) {
      return true;
    }

    //user owns ingredient, but insufficient amount
    const recipeAmount = recipeIng.amount;
    const ownedAmount = ownedIng.amount;

    return ownedAmount < recipeAmount;
  });
};

export default function GroceryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);

  // check logic of this
  /*const inventoryCount = mockInventory.length;
  const missingCount = mockMissingIngredients.reduce(
    (total, recipe) => total + recipe.ingredients.length,
    0,
  );*/

  const groceryCount = mockGroceryList.length;

  //fetch inventory count from firestore
  useEffect(() => {
    const fetchInventoryCount = async () => {
      const inventory = await getIngredientInventory(userId);
      setInventoryCount(inventory.length);
    };

    if (userId) {
      fetchInventoryCount();
    }
  }, [userId]);

  //fetch missing count from firestore
  useEffect(() => {
    const fetchMissingCount = async () => {
      const inventory = await getIngredientInventory(userId);
      const favoriteRecipes = await getFavoriteRecipes(userId);

      const missingIngredients = favoriteRecipes.flatMap((recipe) =>
        getMissingIngredientsForRecipe(recipe.ingredients || [], inventory),
      );
      setMissingCount(missingIngredients.length);
    };

    if (userId) {
      fetchMissingCount();
    }
  }, [userId]);

  const groceryCards = [
    {
      title: `You have ${inventoryCount} ingredients`,
      subtitle: "View your current inventory",
      image: require("../../assets/icons/purpleCart.png"),
      screen: "Inventory",
    },
    {
      title: "Missing for saved recipes",
      subtitle: `${missingCount} ingredients missing`,
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
      selectedCategory === null || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isSearching = debouncedSearchQuery.trim().length > 0;

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-7 pt-28 pb-20">
        <Text className="text-3xl font-bold text-black">
          Smart Grocery List
        </Text>

        <Text className="text-gray-600 mr-20 mt-2">
          See what you have, what you need, and what to cook.
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10">
        {/*search bar*/}
        <View className="bg-gray-100 rounded-full px-5 py-4 flex-row items-center mb-6 shadow">
          <Text className="text-gray-400 mr-3">🔍</Text>

          <TextInput
            placeholder="Search ingredients"
            placeholderTextColor={"gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base mb-2 pl-2"
          />
        </View>

        {/*body*/}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/*render search results OR home content*/}
          {isSearching ? (
            <View>
              <Text className="text-xl font-bold mb-4 px-5">
                Search Results
              </Text>

              {filteredIngredients.map((ingredient) => (
                <Pressable
                  key={ingredient.id}
                  className="flex-row items-center justify-between bg-purple-50 rounded-2xl px-4 py-4 mb-3"
                >
                  <View>
                    <Text className="font-bold text-base">
                      {ingredient.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {ingredient.quantity}
                    </Text>
                  </View>

                  <Text className="text-purple-600 font-bold">Add</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View>
              {/*categories*/}
              <Text className="text-xl font-bold mb-4">Browse Categories</Text>

              <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 24,
                  paddingHorizontal: 5,
                }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      setSelectedCategory(
                        selectedCategory === item.name ? null : item.name,
                      )
                    }
                    className="items-center"
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${selectedCategory === item.name ? "bg-purple-500" : "bg-gray-100"}`}
                    >
                      <Image
                        source={item.image}
                        style={{ width: 40, height: 40 }}
                      />
                    </View>

                    <Text className="text-xs text-gray-600 mt-2 mb-5">
                      {item.name}
                    </Text>
                  </Pressable>
                )}
              />

              {/*grocery navigation cards */}
              <View className="mt-2 gap-y-5 mb-10">
                {groceryCards.map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate(card.screen)}
                    className="bg-purple-50 rounded-2xl p-5 flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-black">
                        {card.title}
                      </Text>

                      <Text className="text-gray-600 mt-1">
                        {card.subtitle}
                      </Text>
                    </View>

                    <Image
                      source={card.image}
                      className="w-20 h-20"
                      resizeMode="contain"
                    />

                    <Text className="text-2xl ml-2">{">"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
