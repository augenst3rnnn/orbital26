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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockRecipes } from "../../data/mockRecipes";
import { useDebounce } from "../../config/hooks/useDebounce";
import { mockInventory } from "../../data/mockInventory";
import { mockMissingIngredients } from "../../data/mockMissingIngredients";
import { mockGroceryList } from "../../data/mockGroceryList";

export default function InventoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedLetterGroup, setSelectedLetterGroup] = useState("A-Z");
  const [showLetterOptions, setShowLetterOptions] = useState(false);

  const letterGroups = [
    { label: "All", start: null, end: null },
    { label: "A-C", start: "a", end: "c" },
    { label: "D-F", start: "d", end: "f" },
    { label: "G-I", start: "g", end: "i" },
    { label: "J-L", start: "j", end: "l" },
    { label: "M-O", start: "m", end: "o" },
    { label: "P-R", start: "p", end: "r" },
    { label: "S-U", start: "s", end: "u" },
    { label: "V-Z", start: "v", end: "z" },
  ];

  const filteredIngredients = mockInventory.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());

    return matchesSearch;
  });

  const inventoryCount = filteredIngredients.length;

  const isSearching = debouncedSearchQuery.trim().length > 0;

  const filterByLetterGroup = mockInventory.filter((ingredient) => {
    const selectedGroup = letterGroups.find(
      (group) => group.label === selectedLetterGroup,
    );

    if (!selectedGroup || selectedGroup.label === "A-Z") {
      return true;
    }

    const firstChar = ingredient.name.toLowerCase()[0];

    return firstChar >= selectedGroup.start && firstChar <= selectedGroup.end;
  });

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-10 pt-28 pb-20">
        <View className="translate-y-6">
          <Text className="text-xl font-bold text-black">
            You have ({inventoryCount})
          </Text>
        </View>
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
          {/*render search results OR all inventory*/}
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
                      {ingredient.amount} {ingredient.unit}
                    </Text>
                  </View>

                  <Text className="text-purple-600 font-bold">Edit</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View>
              <Text className="text-xl font-bold mb-4 px-5">Recent</Text>

              {/*inventory & filter by letter button*/}
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-base">Inventory</Text>

                <TouchableOpacity
                  className="bg-gray-200 rounded-xl px-4 py-1"
                  onPress={() => setShowLetterOptions(!showLetterOptions)}
                >
                  <Text className="text-xs">{selectedLetterGroup}</Text>
                </TouchableOpacity>
              </View>

              {showLetterOptions && (
                <View className="absolute right-0 top-10 bg-white rounded-xl shadow-lg p-2">
                  {letterGroups.map((group) => (
                    <TouchableOpacity
                      key={group.label}
                      onPress={() => {
                        setSelectedLetterGroup(group.label);
                        setShowLetterOptions(false);
                      }}
                      className={`px-6 py-2 pt-2 items-center rounded-lg ${
                        selectedLetterGroup === group.label
                          ? "bg-purple-100"
                          : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selectedLetterGroup === group.label
                            ? "text-purple-700 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {group.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
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
