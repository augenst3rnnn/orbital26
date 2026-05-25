import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import useAuth from "../config/hooks/useAuth";
import { getUserProfile } from "../config/firestoreService";
import { useEffect, useState } from "react";
import { searchRecipesByIngredients } from "../config/hooks/spoonacularService";
import RecipeCard from "../components/RecipeCard";

export default function HomeScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (ingredients.length > 0) {
      setRecipeLoading(true);
      searchRecipesByIngredients(ingredients)
        .then((data) => setRecipes(data))
        .catch((error) => {
          console.error("API Error: ", error);
          setRecipes([]);
        })
        .finally(() => setRecipeLoading(false));
    } else {
      setRecipes([]);
    }
  }, [ingredients]);

  const fetchUserData = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserData(profile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    //use signOut from firebase
    await signOut(auth); //go back welcomescreen
  };

  {
    /*add ingredient func*/
  }
  const addIngredient = () => {
    if (!ingredient.trim()) return;
    if (ingredients.includes(ingredient.trim())) return; // no duplicates
    setIngredients([...ingredients, ingredient.trim()]);
    setIngredient("");
  };

  {
    /*remove ingredient func*/
  }
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 300 }}
      >
        {/*avatar and bell icon*/}
        <View className="px-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../assets/images/avatar.png")}
            style={{ height: 50, width: 50 }}
          />
          <Image
            source={require("../assets/images/bell.png")}
            style={{ height: 30, width: 30 }}
          />
        </View>

        {/*greetings*/}
        <View className="mx-4 space-y-1">
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Good morning {userData ? userData.displayName : "User"}!
          </Text>
          <Text
            style={{ fontSize: 30 }}
            className="font-semibold text-neutral-600"
          >
            What would you like to cook today?
          </Text>
        </View>

        {/*search bar*/}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="Add ingredients"
            placeholderTextColor={"gray"}
            value={ingredient}
            onChangeText={setIngredient}
            onSubmitEditing={addIngredient} //press enter on keyboard adds ingredient
            className="flex-1 text-base mb-2 pl-2"
            style={{ lineHeight: 24, height: 40 }}
          />
          <View className="bg-white rounded-full p-3">
            <Image
              source={require("../assets/images/search.png")}
              style={{ height: 20, width: 20 }}
            />
          </View>
        </View>

        {/*Display selected ingredients */}
        {ingredients.length > 0 && (
          <View className="px-4 mt-4">
            <Text className="font-bold mb-2">
              Your ingredients ({ingredients.length}):
            </Text>
            {ingredients.map((item, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center bg-gray-100 p-2 rounded-lg mb-1"
              >
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(idx)}>
                  <Text className="text-red-500 font-bold text-lg">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/*Display recipes */}
        {recipeLoading && (
          <Text className="px-4 text-gray">Finding recipes...</Text>
        )}

        {recipes.length > 0 && (
          <View className="px-4">
            <Text className="font-bold text-lg mb-3">
              Recipes for you ({recipes.length}):
            </Text>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => console.log("Recipe pressed: ", recipe.title)}
              />
            ))}
          </View>
        )}

        {loading ? (
          <Text>Loading...</Text>
        ) : userData ? (
          <View className="mt-6 bg-gray-100 p-4 rounded-lg">
            <Text className="text-lg font-semibold">
              Name: {userData.displayName}
            </Text>
            <Text className="text-lg mt-2">Email: {userData.email}</Text>
          </View>
        ) : (
          <Text className="text-lg mt-4">No user data found</Text>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="py-3 px-1 w-20 bg-yellow-400 rounded-xl"
        >
          <Text className="text-center font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
