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

export default function ExploreRecipeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = ["all", "breakfast", "main course", "snack", "dessert"];

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); //case-insensitive search
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

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-gray-200 bg-opacity-10 p-10 justify-center items-center">
          <View className="bg-white rounded-3xl p-10 w-full w-11/12 shadow-lg">
            <Image
              source={selectedRecipe?.image}
              className="w-full h-64 rounded-lg pb-2"
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold">{selectedRecipe?.title}</Text>
            <Text className="text-sm text-gray-500 mb-4">
              {selectedRecipe?.summary}
            </Text>
            <View className="bg-yellow-300 rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold mb-2">ingredients</Text>
              <Text className="text-gray-700 mb-4">
                {selectedRecipe?.usedIngredientCount} available,{" "}
                {selectedRecipe?.missedIngredientCount} missing
              </Text>
            </View>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="underline">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
