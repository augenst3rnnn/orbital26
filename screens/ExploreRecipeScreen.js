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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockRecipes } from "../data/mockRecipes";
import RecipeModal from "../components/RecipeModal";
import { useDebounce } from "../config/hooks/useDebounce";

export default function ExploreRecipeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const categories = ["all", "breakfast", "main course", "snack", "dessert"];

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase()); //case-insensitive search
    const matchesType = selectedType === "all" || recipe.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderRecipeCard = ({ item }) => {
    return (
      <TouchableOpacity
        className="bg-white rounded-lg shadow-md p-4 mb-4"
        onPress={() => {
          setSelectedRecipe(item);
          setModalVisible(true);
          console.log("Selected recipe: ", item.title);
        }}
      >
        <Image source={item.image} className="w-full h-44" resizeMode="cover" />
        <View className="mt-2">
          <Text className="text-lg font-semibold">{item.title}</Text>
          <Text className="text-sm text-gray-500">
            {item.readyInMinutes} mins | {item.servings} servings
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Search bar */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        renderItem={renderRecipeCard}
        contentContainerStyle={{ padding: 18 }}
        ListHeaderComponent={
          <View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Explore Recipes
            </Text>

            <Text className="text-gray-600 mb-4">
              Find something delicious to cook today!
            </Text>

            <TextInput
              placeholder="Search recipes..."
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-white rounded-full px-4 py-2 mb-4 shadow-sm"
            />

            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              className="mb-5"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedType(item)}
                  className={`mr-3 px-5 py-3 rounded-2xl ${selectedType === item ? "bg-orange-400" : "bg-white"}`}
                >
                  <Text
                    className={
                      selectedType === item
                        ? "text-white font-semibold"
                        : "text-gray-600 font-medium"
                    }
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        }
      />

      <RecipeModal
        visible={modalVisible}
        recipe={selectedRecipe}
        onClose={() => setModalVisible(false)}
        onReadMore={() => {
          setModalVisible(false);
          navigation.navigate("RecipeDetails", { recipe: selectedRecipe });
        }}
      />
    </SafeAreaView>
  );
}
