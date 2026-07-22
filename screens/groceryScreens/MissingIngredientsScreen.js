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
import useAuth from "../../config/hooks/useAuth";
import {
  getFavoriteRecipes,
  getIngredientInventory,
} from "../../config/firestoreService";
import { getMissingIngredientsForRecipe } from "../../config/services/groceryUtils";

export default function MissingIngredientsScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  //fetch fav recipes from firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchFavoriteRecipes = async () => {
      const recipes = await getFavoriteRecipes(user.uid);
      setFavoriteRecipes(recipes);
    };

    fetchFavoriteRecipes();
  }, [user?.uid]);

  //fetch inventory itemsfrom firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchInventory = async () => {
      const inventory = await getIngredientInventory(user.uid);
      setInventoryItems(inventory);
    };

    fetchInventory();
  }, [user?.uid]);

  const recipesWithMissingIngredients = favoriteRecipes.map((recipe) => {
    const recipeIngredients = recipe.ingredients || [];
    const missingIngredients = getMissingIngredientsForRecipe(
      recipeIngredients,
      inventoryItems,
    );

    return {
      ...recipe,
      missingIngredients, //new property per recipe for missing ingredients
    };
  });

  const renderMissingIngredientsCard = ({ item }) => {
    const missingCount = item.missingIngredients.length;
    const hasNoMissingIngredients = missingCount === 0;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedRecipe(item);
          navigation.navigate("recipeChecklist", {
            recipe: item,
          });
        }}
        className={`border-[1px] rounded-lg shadow pt-2 pb-4 px-2 mb-10 ${
          hasNoMissingIngredients
            ? "border-green-400 bg-green-50" //green border if user has all req ingredients
            : "border-gray-300 bg-gray-50"
        }`}
      >
        {/* recipe title */}
        <Text className="text-xl font-bold px-2 pt-1 pb-3">{item.title}</Text>

        {/* missing count */}
        <View
          className={`rounded-full p-2 w-20 items-center ml-2 mb-2 ${
            hasNoMissingIngredients ? "bg-green-200" : "bg-purple-200"
          }`}
        >
          <Text
            className={`text-[10px] ${
              hasNoMissingIngredients ? "text-green-800" : "text-purple-800"
            } `}
          >
            {hasNoMissingIngredients ? "0 missing" : `${missingCount} missing`}
          </Text>
        </View>

        {/* render missing ingredients */}
        {hasNoMissingIngredients ? (
          <Text className="text-sm text-green-800 px-2 mt-1">
            You have all the ingredients for this recipe!
          </Text>
        ) : (
          item.missingIngredients.map((ingredient) => (
            <View
              key={ingredient.id}
              className="flex-row items-center justify-between gap-2 mb-2"
            >
              <View className="flex-row items-center gap-3">
                {/*check button*/}
                <TouchableOpacity>
                  <View className="w-5 h-5 rounded-full border border-gray-400" />
                </TouchableOpacity>
                <Text className="font-sm">{ingredient.name}</Text>
              </View>

              <Text className="font-xs text-gray-700 mr-4 pt-3">
                {ingredient.amount} {ingredient.unit}
              </Text>
            </View>
          ))
        )}
      </TouchableOpacity>
    );
  };

  const normalizedSearchQuery = debouncedSearchQuery.trim().toLowerCase();

  const isSearching = normalizedSearchQuery.length > 0;

  const displayedRecipes = isSearching
    ? recipesWithMissingIngredients.filter((recipe) =>
        (recipe.title ?? "")
          .trim()
          .toLowerCase()
          .includes(normalizedSearchQuery),
      )
    : recipesWithMissingIngredients;

  //UI
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
        <FlatList
          data={displayedRecipes}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          className="p-3 mb-20"
          renderItem={renderMissingIngredientsCard}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-center">
                {isSearching
                  ? "No matching recipes saved"
                  : "No saved recipes found."}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Text className="text-lg font-semibold pb-4">
              From your saved recipes
            </Text>
          }
        />
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
