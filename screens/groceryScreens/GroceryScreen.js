import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  Alert,
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
  saveIngredient,
  getGroceryList,
  saveGroceryIngredient,
} from "../../config/firestoreService";
import useAuth from "../../config/hooks/useAuth";
import { getMissingIngredientsForRecipe } from "../../config/services/groceryUtils";
import {
  getIngredientInformation,
  searchIngredientByName,
} from "../../config/services/spoonacularService";
import AddIngredientModal from "../../components/AddIngredientModal";

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
  Seafood: "Meat",

  "Milk, Eggs, Other Dairy": "Dairy",
  Cheese: "Dairy",

  Baking: "Pantry",
  "Pasta and Rice": "Pantry",
  "Canned and Jarred": "Pantry",
  Condiments: "Pantry",
  "Spices and Seasonings": "Pantry",
  //add other categories => default pantry ?

  Beverages: "Beverages",
  "Tea and Coffee": "Beverages",
};

const getMainCategory = (aisle) => {
  if (!aisle) {
    return "Pantry";
  }

  return categoryMap[aisle] || "Pantry";
};

//later add function in spoonacularService (fetch real API)
const mockIngredients = [
  { id: 1, name: "Eggs", category: "Dairy", quantity: "12 eggs" },
  { id: 2, name: "Tomato", category: "Produce", quantity: "3" },
  { id: 3, name: "Chicken Breast", category: "Meat", quantity: "500g" },
  { id: 4, name: "Milk", category: "Dairy", quantity: "1L" },
];

export default function GroceryScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);
  const [groceryCount, setGroceryCount] = useState(0);
  const [ingSearchResults, setIngSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIng, setSelectedIng] = useState(null);
  const [ingredientInventory, setIngredientInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);

  //fetch inventory couunt from firestore
  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;

      const fetchInventoryCount = async () => {
        const inventory = await getIngredientInventory(user.uid);
        setInventoryCount(inventory.length);
      };

      fetchInventoryCount();
    }, [user?.uid]),
  );

  //fetch missing count from firestore
  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;

      const fetchMissingCount = async () => {
        const inventory = await getIngredientInventory(user.uid);
        const favoriteRecipes = await getFavoriteRecipes(user.uid);

        const missingIngredients = favoriteRecipes.flatMap((recipe) =>
          getMissingIngredientsForRecipe(recipe.ingredients || [], inventory),
        );
        setMissingCount(missingIngredients.length);
      };

      fetchMissingCount();
    }, [user?.uid]),
  );

  //fetch grocery count from firestore
  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;

      const fetchGroceryCount = async () => {
        const groceryList = await getGroceryList(user.uid);
        setGroceryCount(groceryList.length);
      };

      fetchGroceryCount();
    }, [user?.uid]),
  );

  const groceryCards = [
    {
      title: `You have ${inventoryCount} ingredients`,
      subtitle: "View your current inventory",
      image: require("../../assets/icons/purpleCart.png"),
      screen: "Inventory",
      number: 1,
    },
    {
      title: "Missing for saved recipes",
      subtitle: `${missingCount} ingredients missing`,
      image: require("../../assets/icons/yellowCart.png"),
      screen: "recipeMissingIngredients",
      number: 2,
    },
    {
      title: "My grocery list",
      subtitle: `${groceryCount} items added`,
      image: require("../../assets/icons/checklist.png"),
      screen: "groceryList",
      number: 3,
    },
  ];

  //search using mock ingredients
  /*const filteredIngredients = mockIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });*/

  const isSearching = debouncedSearchQuery.trim().length > 0;

  //search ingredients using Spoonacular API
  useEffect(() => {
    const fetchIngredients = async () => {
      if (!isSearching || debouncedSearchQuery.trim() === "") {
        setIngSearchResults([]);
        return;
      }
      try {
        const results = await searchIngredientByName(debouncedSearchQuery);

        const detailedResults = await Promise.all(
          results.map(async (ingredient) => {
            try {
              const fullIngInfo = await getIngredientInformation(ingredient.id);

              return {
                ...ingredient,
                aisle: fullIngInfo.aisle || "",
              };
            } catch (error) {
              console.log("Error fetching ingredient details:", error);

              return {
                ...ingredient,
                aisle: "",
              };
            }
          }),
        );

        const filteredResults = detailedResults.filter((ingredient) => {
          const ingredientCategory = getMainCategory(ingredient.aisle);

          const matchesCategory =
            selectedCategory === null ||
            ingredientCategory === selectedCategory;

          return matchesCategory;
        });

        setIngSearchResults(filteredResults);
      } catch (error) {
        console.log("Error searching ingredients:", error);
        setIngSearchResults([]);
      }
    };

    fetchIngredients();
  }, [debouncedSearchQuery, isSearching, selectedCategory]);

  /*if (isSearching) {
      searchIngredientByName(debouncedSearchQuery.trim().toLowerCase())
        .then((results) => setIngSearchResults(results))
        .catch((error) => {
          console.error("Error searching ingredients from API:", error);
          setIngSearchResults([]);
        });
    } else {
      setIngSearchResults([]);
    }
  }, [debouncedSearchQuery, isSearching]);*/

  //add to CART
  const handleAddIngredientToCart = async ({
    name,
    amount,
    unit,
    ingredient,
  }) => {
    try {
      if (!amount.trim()) {
        Alert.alert("Missing amount", "Please enter an amount.");
        return;
      }

      {
        /*check valid amount if user input amount*/
      }
      let cleanedAmount = "";

      if (amount.trim() !== "") {
        const amountNumber = Number(amount);

        if (isNaN(amountNumber) || amountNumber <= 0) {
          Alert.alert("Invalid amount", "Please enter a valid amount.");
          return;
        }

        cleanedAmount = amountNumber;
      }

      let fullIngredientData = ingredient;

      //fetch fields like aisle
      if (ingredient?.id) {
        fullIngredientData = await getIngredientInformation(ingredient.id);
      }

      const ingredientToSave = {
        name: name,
        amount: cleanedAmount,
        unit: unit?.trim().toLowerCase() || "",
        image: fullIngredientData?.image || "",
        aisle: fullIngredientData?.aisle || "",
        expiryDate: "",
      };

      const updatedGroceryCart = await saveGroceryIngredient(
        user.uid,
        ingredient.id,
        ingredientToSave,
      );

      setGroceryList(updatedGroceryCart);
      setShowAddModal(false);
      setSelectedIng(null);
    } catch (error) {
      {
        /*catch error thrown from saveIngredient function*/
      }
      if (error.message === "Unit Mismatch!") {
        Alert.alert(
          "Different unit",
          "This ingredient already exists with a different unit. Please use the same unit before adding to inventory.",
        );
        return;
      }

      console.log("Error adding ingredient:", error);
      Alert.alert("Error", "Could not add ingredient.");
    }
  };

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
        <View className="bg-gray-100 rounded-full px-4 py-2 flex-row items-center mb-6 shadow">
          <View className="bg-white rounded-full p-3">
            <Image
              source={require("../../assets/icons/search.png")}
              style={{
                height: 20,
                width: 20,
              }}
            />
          </View>

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

              {ingSearchResults.map((ingredient) => (
                <View
                  key={String(ingredient.id)}
                  className="flex-row items-center justify-between bg-purple-50 rounded-2xl px-5 py-6 mb-4"
                >
                  <Text className="font-bold text-base">{ingredient.name}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedIng(ingredient);
                      setShowAddModal(true);
                    }}
                  >
                    <View className="bg-gray-50 rounded-xl p-3 shadow">
                      <Text className="text-purple-600 font-bold">Add</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
                    testID={`nav-card-${card.number}`}
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

      {/* add ingredient modal */}
      <AddIngredientModal
        visible={showAddModal}
        ingredient={selectedIng}
        onClose={() => {
          setShowAddModal(false);
          setSelectedIng(null);
        }}
        onSave={handleAddIngredientToCart}
      />
    </View>
  );
}
