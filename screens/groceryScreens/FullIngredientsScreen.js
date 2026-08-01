import { useState, useEffect, useMemo } from "react";
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
import useAuth from "../../config/hooks/useAuth";
import {
  getIngredientInventory,
  getGroceryList,
  updateIngredientStatus,
} from "../../config/firestoreService";
import {
  getIngredientStatus,
  ingredientsMatch,
} from "../../config/services/groceryUtils";

export default function FullIngredientsScreen({ navigation, route }) {
  const { recipe } = route.params;
  const { user } = useAuth();

  const [ingredientInventory, setIngredientInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const ingredients = recipe.extendedIngredients || recipe.ingredients || [];

  const haveCount = useMemo(() => {
    return ingredients.filter((ingredient) => {
      return (
        getIngredientStatus(ingredient, ingredientInventory, groceryList) ===
        "have"
      );
    }).length;
  }, [ingredients, ingredientInventory, groceryList]);

  const totalIngredients = ingredients.length;

  const progress = totalIngredients > 0 ? haveCount / totalIngredients : 0;

  const renderIngredient = ({ item }) => {
    const status = getIngredientStatus(item, ingredientInventory, groceryList);

    const isSelected =
      selectedIngredient && ingredientsMatch(selectedIngredient, item);

    const anotherIngredientSelected = selectedIngredient && !isSelected;

    return (
      <TouchableOpacity
        testID={`ingredient-${item.id}`}
        className="flex-row items-center py-3"
        style={{
          opacity: anotherIngredientSelected ? 0.2 : 1,
          transform: [
            {
              scale: isSelected ? 1.03 : 1,
            },
          ],
        }}
        onPress={(event) => {
          event.stopPropagation();
          setSelectedIngredient(item);
        }}
        activeOpacity={0.8}
      >
        {/*colour of buttons*/}
        <View
          className={[
            "w-6 h-6 rounded-full mr-3 items-center justify-center",
            status === "have"
              ? "bg-purple-700"
              : status === "inCart"
                ? "bg-gray-300"
                : "border-2 border-gray-300 bg-white",
          ].join(" ")}
        >
          {(status === "have" || status === "inCart") && (
            <View>
              <Image
                source={require("../../assets/icons/whiteTick.png")}
                className="w-6 h-6"
              />
            </View>
          )}
        </View>

        {/*colour of text*/}
        <Text
          className={[
            "flex-1 text-lg",
            status === "inCart" ? "text-gray-400" : "text-black",
          ].join(" ")}
        >
          {item.name}
        </Text>

        <Text
          className={[
            "text-base",
            status === "inCart" ? "text-gray-400" : "text-gray-600",
          ].join(" ")}
        >
          {item.amount} {item.unit}
        </Text>
      </TouchableOpacity>
    );
  };

  //status-change handler
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedIngredient || !user?.uid || isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);

      const updatedData = await updateIngredientStatus(
        user.uid,
        selectedIngredient,
        newStatus,
      );

      //update UI using the returned arrays
      setIngredientInventory(updatedData.ingredientInventory);

      setGroceryList(updatedData.groceryList);

      setSelectedIngredient(null);
    } catch (error) {
      Alert.alert("Unable to update ingredient", "Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  //fetch inventory & grocery list in state
  useEffect(() => {
    const fetchIngredientStatuses = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        const [inventoryData, groceryData] = await Promise.all([
          getIngredientInventory(user.uid),
          getGroceryList(user.uid),
        ]);

        setIngredientInventory(inventoryData);
        setGroceryList(groceryData);
      } catch (error) {
        console.log("Error fetching ingredient statuses:", error);
      }
    };

    fetchIngredientStatuses();
  }, [user?.uid]);

  //confirmation alerts
  const confirmStatusChange = (newStatus) => {
    if (!selectedIngredient) {
      return;
    }

    const ingredientName = selectedIngredient.name || "this ingredient";

    if (newStatus === "have") {
      Alert.alert(
        "Add to inventory?",
        `Add ${ingredientName} to your inventory?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            onPress: () => handleUpdateStatus("have"),
          },
        ],
      );

      return;
    }

    if (newStatus === "inCart") {
      Alert.alert(
        "Add to cart?",
        `Add ${ingredientName} to your grocery cart?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            onPress: () => handleUpdateStatus("inCart"),
          },
        ],
      );

      return;
    }

    handleUpdateStatus("toBuy");
  };

  return (
    <View className="flex-1 bg-white">
      {/*yellow header*/}
      <View className="bg-yellow-200 px-10 pt-28 pb-20">
        <View className="translate-y-6">
          <Text className="text-xl font-bold text-black">
            Recipes & Ingredients
          </Text>
        </View>
      </View>

      {/*white body*/}
      <Pressable
        className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 -mt-10"
        //unhighlight panel by clicking anywhere else
        onPress={() => setSelectedIngredient(null)}
      >
        <Text className="text-gray-600 pl-2 pt-1 pb-4">
          Check off ingredients as you get them!
        </Text>

        {/*recipe card*/}
        <View className="flex-1 border border-gray-300 rounded-[25px] overflow-hidden">
          <View className="flex-row border-b border-gray-300">
            <Image
              source={{ uri: recipe.image }}
              className="w-28 h-full"
              resizeMode="cover"
            />

            <View className="flex-1 px-4 py-3 justify-center">
              <Text className="text-lg font-bold text-black" numberOfLines={2}>
                {recipe.title}
              </Text>

              <Text className="text-sm text-gray-600 mt-1">
                {haveCount} of {totalIngredients} ingredients
              </Text>

              <View className="h-3 bg-purple-100 rounded-full mt-2 overflow-hidden">
                <View
                  className="h-full bg-purple-600 rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/*ingredient list*/}
          <FlatList
            data={ingredients}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) =>
              String(item.id || `${item.name}-${index}`)
            }
            renderItem={renderIngredient}
            contentContainerStyle={{
              paddingHorizontal: 28,
              paddingVertical: 22,
            }}
          />
        </View>
      </Pressable>

      {/*have, don't have, in grocery list buttons*/}
      <Pressable
        onPress={(event) => event.stopPropagation()}
        className={[
          "px-8 flex-row justify-between items-center",
          selectedIngredient
            ? "pt-12 pb-12 rounded-3xl border-2 border-gray-200 mx-4 mb-8 shadow-3xl"
            : "pt-5 pb-5",
        ].join(" ")}
      >
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              testID="status-have"
              disabled={!selectedIngredient || isUpdating}
              onPress={() => confirmStatusChange("have")}
            >
              <View className="w-6 h-6 rounded-full bg-purple-700 mr-1" />
            </TouchableOpacity>
            <Text
              className={
                selectedIngredient
                  ? "text-lg text-black font-bold"
                  : "text-gray-400"
              }
            >
              Have it
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              disabled={!selectedIngredient || isUpdating}
              onPress={() => confirmStatusChange("toBuy")}
            >
              <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-1" />
            </TouchableOpacity>
            <Text
              className={
                selectedIngredient
                  ? "text-lg text-black font-bold"
                  : "text-gray-400"
              }
            >
              Don't have
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              disabled={!selectedIngredient || isUpdating}
              onPress={() => confirmStatusChange("inCart")}
            >
              <View className="w-6 h-6 rounded-full bg-gray-200 mr-1" />
            </TouchableOpacity>
            <Text
              className={
                selectedIngredient
                  ? "text-lg text-black font-bold"
                  : "text-gray-400"
              }
            >
              In cart
            </Text>
          </View>
        </View>
      </Pressable>

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
