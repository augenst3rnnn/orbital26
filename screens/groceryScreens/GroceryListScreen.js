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
import { getGroceryList } from "../../config/firestoreService";
import useAuth from "../../config/hooks/useAuth";

export default function MissingIngredientsScreen({ navigation }) {
  const { user } = useAuth();
  const [groceryList, setGroceryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchGroceryList = async () => {
      if (!user?.uid) {
        setGroceryList([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const storedGroceryList = await getGroceryList(user.uid);
        setGroceryList(storedGroceryList);
      } catch (error) {
        console.log("Error fetching grocery list:", error);
        setGroceryList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroceryList();
  }, [user?.uid]);

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

  const toBuyCount = groceryList.filter(
    (ingredient) => ingredient.status === "toBuy",
  ).length;

  const inCartCount = groceryList.filter(
    (ingredient) => ingredient.status === "inCart",
  ).length;

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
              count = toBuyCount;
            }

            if (filter.value === "inCart") {
              count = inCartCount;
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
