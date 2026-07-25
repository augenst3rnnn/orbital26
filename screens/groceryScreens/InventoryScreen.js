import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { useDebounce } from "../../config/hooks/useDebounce";
import EditIngredientModal from "../../components/EditIngredientModal";
import {
  getIngredientInformation,
  searchIngredientByName,
} from "../../config/services/spoonacularService";
import AddIngredientModal from "../../components/AddIngredientModal";
import {
  saveIngredient,
  getIngredientInventory,
  deleteIngredient,
} from "../../config/firestoreService";
import useAuth from "../../config/hooks/useAuth";

export default function InventoryScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedLetterGroup, setSelectedLetterGroup] = useState("A-Z");
  const [showLetterOptions, setShowLetterOptions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();

    if (trimmedQuery === "") {
      return;
    }

    setRecentSearches((prevSearches) => {
      const withoutDuplicate = prevSearches.filter(
        (search) => search.toLowerCase() !== trimmedQuery.toLowerCase(),
      );

      //most recent search in front
      return [trimmedQuery, ...withoutDuplicate].slice(0, 5);
    });
  }, [debouncedSearchQuery]);

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

  useEffect(() => {
    if (!user?.uid) return;

    const fetchInventory = async () => {
      const data = await getIngredientInventory(user.uid);
      setInventory(data);
    };

    fetchInventory();
  }, [user?.uid]);

  const filteredIngredients = inventory.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());

    return matchesSearch;
  });

  const inventoryCount = filteredIngredients.length;

  const isSearching = debouncedSearchQuery.trim().length > 0;

  const filterByLetterGroup = inventory.filter((ingredient) => {
    const selectedGroup = letterGroups.find(
      (group) => group.label === selectedLetterGroup,
    );

    if (!selectedGroup || selectedGroup.label === "All") {
      return true;
    }

    const firstChar = ingredient.name.toLowerCase()[0];

    return firstChar >= selectedGroup.start && firstChar <= selectedGroup.end;
  });

  const handleOpenEditModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowEditModal(true);
  };

  const validateExpiryDate = (expiryDate) => {
    const trimmedDate = expiryDate.trim();

    //allow empty expiry date
    if (trimmedDate === "") {
      return "";
    }

    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!datePattern.test(trimmedDate)) {
      throw new Error("Invalid expiry date format. Please use DD/MM/YYYY.");
    }

    const [day, month, year] = trimmedDate.split("/").map(Number);

    const date = new Date(year, month - 1, day);

    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 && //month is 0-indexed
      date.getDate() === day;
    if (!isValidDate) {
      throw new Error("Invalid expiry date. Please enter a real date.");
    }

    return trimmedDate;
  };

  const handleEditIngredient = async ({ amount, expiryDate }) => {
    try {
      const currentInventory = await getIngredientInventory(user.uid);
      const ingredientToSave = currentInventory.find(
        (item) => item.id === selectedIngredient.id,
      );

      if (!ingredientToSave) {
        Alert.alert("Error", "Ingredient not found.");
        return;
      }

      let cleanedAmount = ingredientToSave.amount;
      let cleanedExpiryDate = ingredientToSave.expiryDate || "";

      //only update amount if user typed smth
      if (amount.trim() !== "") {
        const amountNumber = Number(amount);

        if (isNaN(amountNumber) || amountNumber <= 0) {
          Alert.alert("Invalid amount", "Please enter a valid amount.");
          return;
        }

        cleanedAmount = amountNumber;
      }

      //only update expiry date if user typed smth
      if (expiryDate.trim() !== "") {
        cleanedExpiryDate = validateExpiryDate(expiryDate);
      }

      const editedIngredient = {
        ...ingredientToSave,
        amount: cleanedAmount,
        expiryDate: cleanedExpiryDate,
      };

      const updatedInventory = await saveIngredient(
        user.uid,
        selectedIngredient.id,
        editedIngredient,
        false, //overwrite amount, don't add onto og amount!
      );

      setInventory(updatedInventory);
      setShowEditModal(false);
      setSelectedIngredient(null);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update ingredient.");
    }
  };

  const handleAddIngredient = async ({ name, amount, unit }) => {
    try {
      if (!user?.uid) return;

      if (!name.trim()) {
        Alert.alert("Missing name", "Please enter an ingredient name.");
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

      //searchIngredientByName returns array of size5 => extract top result
      const ingredientResults = await searchIngredientByName(name);
      if (!ingredientResults || ingredientResults.length === 0) {
        Alert.alert(
          "Ingredient not found",
          "Please try another ingredient name.",
        );
        return;
      }

      const topIngredient = ingredientResults[0]; //await ensures promise => array

      let fullIngredientData = topIngredient;

      if (topIngredient?.id) {
        fullIngredientData = await getIngredientInformation(topIngredient.id);
      }

      const updatedInventory = await saveIngredient(
        user.uid,
        topIngredient.id,
        {
          name: topIngredient.name ?? name.trim(),
          amount: cleanedAmount || "", //amount & unit are optional
          unit: unit?.trim().toLowerCase() || "",
          image: fullIngredientData.image || "",
          aisle: fullIngredientData.aisle || "",
        },
      );

      //input collected by AddIngredientModal
      setInventory(updatedInventory);
      setShowAddModal(false);
    } catch (error) {
      if (error.message === "Unit Mismatch!") {
        Alert.alert(
          "Different unit",
          "This ingredient already exists with a different unit. Please use the same unit before adding to inventory.",
        );
        return;
      }

      console.error("Error adding ingredient:", error);
      Alert.alert("Error", "Could not add ingredient.");
    }
  };

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
            placeholder="Search your inventory"
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
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          {/*render search results OR all inventory*/}
          {isSearching ? (
            <View>
              <Text className="text-xl font-bold mb-4 px-5">
                Search Results
              </Text>

              {filteredIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  className="flex-row items-center justify-between bg-purple-50 rounded-2xl px-4 py-4 mb-6"
                  onPress={() => {
                    handleOpenEditModal(ingredient);
                  }}
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
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              {/*recent searches*/}
              {recentSearches.length > 0 && (
                <View className="mb-4">
                  <Text className="text-xl font-bold mb-3 px-5">Recent</Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-4 px-2">
                      {recentSearches.map((search) => (
                        <TouchableOpacity
                          key={search}
                          onPress={() => setSearchQuery(search)}
                          className="bg-purple-100 px-4 py-1 rounded-xl"
                        >
                          <Text className="text-purple-700 text-xs font-semibold">
                            {search}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
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
              {/*dropdown options*/}
              {showLetterOptions && (
                <View className="absolute right-0 top-10 bg-white rounded-xl shadow-lg p-2 z-50">
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
              {/*display all inventory*/}
              <View>
                {filterByLetterGroup.map((ingredient) => (
                  <View key={ingredient.id}>
                    <View className="flex-row items-center justify-between mt-8 px-2">
                      <View className="gap-2">
                        <Text className="font-semibold text-lg">
                          {ingredient.name}
                        </Text>
                        <Text className="text-sm text-gray-700">
                          {ingredient.amount} {ingredient.unit}
                        </Text>
                      </View>

                      <View className="items-end gap-4">
                        <TouchableOpacity
                          onPress={() => {
                            handleOpenEditModal(ingredient);
                          }}
                        >
                          <Text className="text-lg">...</Text>
                        </TouchableOpacity>

                        {ingredient.expiryDate ? (
                          <Text className="text-xs text-gray-700">
                            Exp. in {ingredient.expiryDate}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <View className="w-full h-[1px] bg-gray-400 mt-4" />
                  </View>
                ))}
              </View>
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

      {/*edit ingredient modal popup*/}
      <EditIngredientModal
        visible={showEditModal}
        ingredient={selectedIngredient}
        onClose={() => {
          setShowEditModal(false);
          setSelectedIngredient(null);
        }}
        onSave={handleEditIngredient}
        onDelete={async (ingredientToDelete) => {
          try {
            const updatedInventory = await deleteIngredient(
              user.uid,
              ingredientToDelete,
            );

            setInventory(updatedInventory);

            setShowEditModal(false);
            setSelectedIngredient(null);
          } catch (error) {
            console.log("Error deleting ingredient from screen:", error);
            Alert.alert("Error", "Could not delete ingredient.");
          }
        }}
      />

      {/*add ingredient to inventory button*/}
      <TouchableOpacity
        className="border-2 border-yellow-500 absolute bottom-20 right-10 w-16 h-16 rounded-full bg-yellow-400 shadow-lg flex items-center justify-center"
        onPress={() => setShowAddModal(true)}
        testID="open-add-ingredient-modal"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      {/*add ingredient modal popup*/}
      <AddIngredientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddIngredient}
      />
    </View>
  );
}
