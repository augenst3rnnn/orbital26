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
import {
  saveGroceryIngredient,
  deleteGroceryIngredient,
  getGroceryList,
  saveIngredient,
  getFavoriteRecipes,
  getIngredientInventory,
} from "../../config/firestoreService";
import useAuth from "../../config/hooks/useAuth";
import {
  getMissingIngredientsForRecipe,
  ingredientsMatch,
} from "../../config/services/groceryUtils";
import { setSignature } from "react-refresh";

export default function MissingIngredientsScreen({ navigation }) {
  const { user } = useAuth();
  const [favRecipes, setFavRecipes] = useState([]);
  const [ingredientInventory, setIngredientInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedFilter, setSelectedFilter] = useState("all");

  //fetch fav recipes, ingredient inventory, & grocery list at once
  //useFocusEffect - follow changes in state in FullIngredientsScreen
  useFocusEffect(
    useCallback(() => {
      const fetchGroceryScreenData = async () => {
        if (!user?.uid) {
          setFavRecipes([]);
          setIngredientInventory([]);
          setGroceryList([]);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);

          const [storedFavRecipes, storedInventory, storedGroceryList] =
            await Promise.all([
              getFavoriteRecipes(user.uid),
              getIngredientInventory(user.uid),
              getGroceryList(user.uid),
            ]);

          setFavRecipes(storedFavRecipes);
          setIngredientInventory(storedInventory);
          setGroceryList(storedGroceryList);
        } catch (error) {
          console.log("Error fetching grocery screen data:", error);

          setFavRecipes([]);
          setIngredientInventory([]);
          setGroceryList([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGroceryScreenData();
    }, [user?.uid]),
  );

  const filters = [
    { label: "All", value: "all" },
    { label: "To Buy", value: "toBuy" },
    { label: "In Cart", value: "inCart" },
  ];

  const filteredGroceryList = groceryList.filter((ingredient) => {
    if (selectedFilter == "all") {
      return true;
    }

    return ingredient.status === selectedFilter;
  });

  const allMissingIngredients = favRecipes.flatMap((recipe) =>
    getMissingIngredientsForRecipe(
      recipe.extendedIngredients || recipe.ingredients || [],
      ingredientInventory,
    ),
  );

  //remove duplicates
  const uniqueMissingIngredients = allMissingIngredients.filter(
    (ingredient, index, array) =>
      index ===
      array.findIndex(
        (item) =>
          item.id === ingredient.id ||
          item.name?.toLowerCase() === ingredient.name?.toLowerCase(),
      ),
  );

  //toBuy - missing ingredients NOT stored in groceryList
  const toBuy = uniqueMissingIngredients.filter(
    (missingIngredient) =>
      !groceryList.some(
        (cartIngredient) =>
          cartIngredient.id === missingIngredient.id ||
          cartIngredient.name?.toLowerCase() ===
            missingIngredient.name?.toLowerCase(),
      ),
  );

  //inCart - simply groceryList (no need to check status anymore)
  const inCart = groceryList.filter(
    (ingredient) => ingredient.status === "inCart",
  );

  //pressing a ToBuy button - add to cart => add to groceryList
  const handleAddToCart = async (ingredient) => {
    if (!user?.uid) {
      return;
    }

    try {
      const groceryIngredient = {
        ...ingredient,
        status: "inCart",
      };

      await saveGroceryIngredient(user.uid, ingredient.id, groceryIngredient);

      setGroceryList((currentList) => [...currentList, groceryIngredient]);
    } catch (error) {
      console.log("Error adding ingredient to cart:", error);

      Alert.alert("Error", "Could not add this ingredient to your cart.");
    }
  };

  //pressing an inCart button - add to inventory
  const handleMoveToInventory = async (ingredient) => {
    if (!user?.uid) {
      return;
    }

    try {
      const { status, ...inventoryIngredient } = ingredient;

      await saveIngredient(user.uid, ingredient.id, inventoryIngredient);

      await deleteGroceryIngredient(user.uid, ingredient);

      setGroceryList((currentList) =>
        currentList.filter(
          (item) =>
            item.id !== ingredient.id &&
            item.name?.toLowerCase() !== ingredient.name.toLowerCase(),
        ),
      );

      setIngredientInventory((currentInventory) => [
        ...currentInventory,
        inventoryIngredient,
      ]);
    } catch (error) {
      console.log("Error moving ingredient to inventory:", error);

      Alert.alert("Error", "Could not move this ingredient to your inventory.");
    }
  };

  /*
  const handleTickIngredient = async (ingredient) => {
    if (!user?.uid) {
      return;
    }

    try {
      const { status, ...inventoryIngredient } = ingredient; //remove status property

      await saveIngredient(user.uid, ingredient.id, inventoryIngredient);

      await deleteGroceryIngredient(user.uid, ingredient);

      setGroceryList((currentList) =>
        currentList.filter((item) => !ingredientsMatch(item, ingredient)),
      );
    } catch (error) {
      console.log("Error moving ingredient to inventory", error);
      Alert.alert("Error", "Could not move the ingredient to your inventory.");
    }
  };*/

  const ToBuyRow = ({ ingredient, onAddToCart }) => {
    return (
      <View className="flex-row items-center py-3">
        <TouchableOpacity onPress={() => onAddToCart(ingredient)}>
          <Image
            source={require("../../assets/icons/grocery.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>

        <Text className="flex-1 text-base pl-2">{ingredient.name}</Text>

        <Text className="text-sm text-gray-500">
          {ingredient.amount} {ingredient.unit}
        </Text>
      </View>
    );
  };

  const InCartRow = ({ ingredient, onMoveToInventory }) => {
    return (
      <View className="flex-row items-center py-3">
        <TouchableOpacity
          onPress={() => onMoveToInventory(ingredient)}
          className="mr-3 h-5 w-5 rounded-full border border-gray-400"
        />

        <Text className="flex-1 text-base">{ingredient.name}</Text>

        <Text className="text-sm text-gray-500">
          {ingredient.amount} {ingredient.unit}
        </Text>
      </View>
    );
  };

  const ToBuySection = ({ ingredients, onAddToCart }) => {
    if (ingredients.length === 0) {
      return null;
    }

    return (
      <View className="mx-6 mt-6">
        <Text className="mb-2 text-base font-semibold">To Buy</Text>

        {ingredients.map((ingredient) => (
          <ToBuyRow
            key={`to-buy-${ingredient.id}-${ingredient.name}`}
            ingredient={ingredient}
            onAddToCart={onAddToCart}
          />
        ))}
      </View>
    );
  };

  const InCartSection = ({ ingredients, onMoveToInventory }) => {
    if (ingredients.length === 0) {
      return null;
    }

    return (
      <View className="mx-6 mt-6">
        <Text className="mb-2 text-base font-semibold">In Cart</Text>

        {ingredients.map((ingredient) => (
          <InCartRow
            key={`in-cart-${ingredient.id}-${ingredient.name}`}
            ingredient={ingredient}
            onMoveToInventory={onMoveToInventory}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-10 pt-28 pb-20">
        <View className="translate-y-6">
          <Text className="text-xl font-bold text-black">My Grocery List</Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10">
        {/*toggle bar*/}
        <View className="flex-row bg-white border-gray-300 border-b border-r rounded-full mr-4 my-2 ml-4 mb-6 shadow-lg">
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.value;

            let count = groceryList.length;

            if (filter.value === "toBuy") {
              count = toBuy.length;
            }

            if (filter.value === "inCart") {
              count = inCart.length;
            }

            return (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                className={`flex-1 items-center rounded-full py-3 ${
                  isSelected ? "bg-yellow-400" : "bg-white"
                }`}
              >
                <Text className="font-semibold">
                  {filter.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/*body*/}
        {/*display all by default*/}
        {selectedFilter === "all" && (
          <View>
            <ToBuySection ingredients={toBuy} onAddToCart={handleAddToCart} />

            {toBuy.length > 0 && inCart.length > 0 && (
              <View className="mx-2 mt-5 border-t border-gray-300" />
            )}

            <InCartSection
              ingredients={inCart}
              onMoveToInventory={handleMoveToInventory}
            />
          </View>
        )}

        {/*display to Buy*/}
        {selectedFilter === "toBuy" && (
          <ToBuySection ingredients={toBuy} onAddToCart={handleAddToCart} />
        )}

        {/*display in Cart*/}
        {selectedFilter === "inCart" && (
          <InCartSection
            ingredients={inCart}
            onMoveToInventory={handleMoveToInventory}
          />
        )}
      </View>

      {/*empty grocery list*/}
      {groceryList.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Your grocery list is empty.</Text>
        </View>
      )}

      {/*back button*/}
      <TouchableOpacity
        className="absolute top-14 left-5 bg-white rounded-full p-2 shadow"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-black text-xl">←</Text>
      </TouchableOpacity>

      {/*add item button*/}
      <TouchableOpacity className="absolute bottom-10 left-10 right-10 items-center bg-yellow-400 rounded-3xl px-6 py-2 mb-10">
        <Text className="text-black text-lg">+ Add item</Text>
      </TouchableOpacity>
    </View>
  );
}
