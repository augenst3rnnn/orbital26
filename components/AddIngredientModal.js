import { useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";

export default function AddIngredientModal({
  visible,
  ingredient,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");

  const handleSave = () => {
    onSave({
      name: isFromSearchResult ? ingredient.name : name,
      amount,
      unit,
      ingredient,
    });

    //clear input after saving
    setName("");
    setAmount("");
    setUnit("");
  };

  const isFromSearchResult = !!ingredient; //check if ingredient is passed in as a prop(from search result) or not(from manual input in inventory)

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center">
        {/*blurred + dark bg*/}
        <BlurView
          intensity={20}
          className="absolute top-0 bottom-0 left-0 right-0"
        />
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-black/30" />

        {/*white modal popup*/}
        <View className="bg-white rounded-3xl p-6 w-[80%]">
          {/*close*/}
          <View className="items-end -mt-2">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl text-purple-700">x</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-center mb-6">
            {isFromSearchResult ? `Add ${ingredient.name}` : "Add Ingredient"}
          </Text>

          {isFromSearchResult ? (
            <View className="bg-purple-100 rounded-xl p-4 mb-6">
              <Text className="text-gray-700 items-center">
                {ingredient.name}
              </Text>
            </View>
          ) : (
            <TextInput
              placeholder="name"
              value={name}
              onChangeText={setName}
              className="bg-purple-100 rounded-xl p-4 mb-6"
            />
          )}

          <TextInput
            placeholder="amount"
            value={amount}
            onChangeText={setAmount}
            className="bg-purple-100 rounded-xl p-4 mb-6"
          />

          <TextInput
            placeholder="unit"
            value={unit}
            onChangeText={setUnit}
            className="bg-purple-100 rounded-xl p-4 mb-6"
          />

          <TouchableOpacity
            onPress={handleSave}
            className="bg-purple-700 rounded-xl items-center mt-2 mx-20 p-4 mb-2"
          >
            <Text className="text-white font-bold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
