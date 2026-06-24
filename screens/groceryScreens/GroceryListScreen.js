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

{
  /*placeholder first*/
}
export default function MissingIngredientsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
        <View className="bg-gray-100 rounded-full py-4 mr-4 ml-4 items-center mb-6 shadow-lg">
          <Text className="text-gray-400 mr-3">All/ To Buy/ In Cart</Text>
        </View>

        {/*body*/}
        <ScrollView></ScrollView>
      </View>

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
