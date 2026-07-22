import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten Free" },
  { id: "dairyFree", label: "Diary Free" },
  { id: "halal", label: "Halal" },
  { id: "ketogenic", label: "Keto" },
  { id: "paleo", label: "Paleo" },
];

export default function Categories({ onSelectDietary, selectedDietary }) {
  const toggleDietary = (dietId) => {
    let newSelection;
    if (selectedDietary.includes(dietId)) {
      newSelection = selectedDietary.filter((id) => id !== dietId);
    } else {
      newSelection = [...selectedDietary, dietId];
    }
    onSelectDietary(newSelection);
  };

  return (
    <View className="mb-4">
      <Text className="text-xl font-bold mb-4">Dietary Preferences</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2"
      >
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => toggleDietary(option.id)}
            className={`px-4 py-2 rounded-full mr-3 ${
              selectedDietary.includes(option.id)
                ? "bg-green-500"
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedDietary.includes(option.id)
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
