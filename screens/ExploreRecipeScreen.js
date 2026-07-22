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
    <View className="flex-1 bg-gray-50">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-7 pt-28 pb-20">
        <Text className="text-3xl font-bold text-black">Explore Recipes</Text>

        <Text className="text-gray-600 mr-20 mt-2 mb-3">
          Find something delicious to cook today!
        </Text>
      </View>

      {/*white body*/}
      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10">
        {/*search bar*/}

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={true}
          renderItem={renderRecipeCard}
          contentContainerStyle={{ padding: 5 }}
          ListHeaderComponent={
            <View>
              <View className="bg-gray-100 rounded-full px-4 py-2 flex-row items-center mb-6 shadow">
                <View className="bg-white rounded-full p-3">
                  <Image
                    source={require("../assets/icons/search.png")}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>

                <TextInput
                  placeholder="Search recipes..."
                  placeholderTextColor={"gray"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 text-base mb-2 pl-2"
                />
              </View>

              <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                className="mb-5"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSelectedType(item)}
                    className={`mr-3 px-5 py-2 rounded-2xl ${selectedType === item ? "bg-yellow-400" : "bg-white"}`}
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
      </View>
    </View>
  );
}
