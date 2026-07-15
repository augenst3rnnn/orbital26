import { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";

export default function EditIngredientModal({
  visible,
  ingredient,
  onClose,
  onSave,
  onDelete,
}) {
  const [amount, setAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const getIngredientImageURL = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://img.spoonacular.com/ingredients_100x100/${image}`;
  };

  useEffect(() => {
    if (ingredient) {
      setAmount(String(ingredient.amount || ""));
      setExpiryDate(ingredient.expiryDate || "");
    }
  }, [ingredient]);

  if (!ingredient) {
    return null;
  }

  const handleExpiryChange = (text) => {
    //keep only numbers
    const digits = text.replace(/\D/g, "").slice(0, 8);

    let formatted = digits;

    if (digits.length > 2 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }

    setExpiryDate(formatted);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      {/*dark bg overlay*/}
      <View className="flex-1 justify-end">
        <BlurView
          intensity={20}
          className="absolute top-0 bottom-0 left-0 right-0"
        />
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-black/30" />

        {/*white modal popup*/}
        <View className="bg-white rounded-t-[40px] px-6 pt-5 pb-10 max-h-[80%]">
          {/*close button*/}
          <View className="items-end mr-1">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-3xl text-purple-700">x</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center justify-center">
            {/*image and ingredient name*/}
            <View className="items-center justify-center gap-3">
              <Text className="text-xl font-semibold">Edit Ingredient</Text>
              <Image
                source={{ uri: getIngredientImageURL(ingredient.image) }}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />

              <Text className="text-xl font-bold">{ingredient.name}</Text>
            </View>

            {/*edit amount*/}
            <View className="w-full mt-4 mb-4">
              <Text className="font-semibold text-purple-800 text-xs items-start pl-3 mb-2">
                Amount ({ingredient.unit})
              </Text>
              <View className="bg-purple-200 rounded-lg p-4">
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  className="font-semibold"
                />
              </View>
            </View>

            {/*edit expiry*/}
            <View className="w-full mt-4 mb-4">
              <Text className="font-semibold text-purple-800 text-xs items-start pl-3 mb-2">
                Expiry
              </Text>
              <View className="bg-purple-200 rounded-lg p-4">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require("../assets/icons/calendar.png")}
                    style={{ width: 22, height: 22 }}
                  />
                  <TextInput
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    placeholder="DD/MM/YYYY"
                    keyboardType="numeric"
                    maxLength={10}
                    className="font-semibold"
                  />
                </View>
              </View>
            </View>
          </View>

          {/*delete button*/}
          <View className="flex-row items-center justify-center gap-3 mt-2">
            <View className="border-2 border-purple-700 rounded-lg px-10 pt-4 pb-4">
              <TouchableOpacity
                onPress={() => {
                  if (!ingredient) return;

                  Alert.alert(
                    "Delete Ingredient",
                    `Remove ${ingredient.name} from your inventory?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => {
                          onDelete(ingredient);
                        },
                      },
                    ],
                  );
                }}
              >
                <Text className="font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>

            {/*save changes button*/}
            <View className="bg-purple-700 rounded-lg px-4 pt-4 pb-4">
              <TouchableOpacity onPress={() => onSave({ amount, expiryDate })}>
                <Text className="text-white font-semibold">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
