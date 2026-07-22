import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

//helper function to handle both image types
const getImageSource = (image) => {
  if (!image) {
    return require("../assets/icons/avatar.png"); //fallback image
  }
  if (typeof image === "string") {
    return { uri: image }; //api images uses URL string
  }
  return image; // mock recipe images uses require()
};

export default function MealCard({
  meal,
  mealType,
  onPress,
  onAdd,
  onRemove,
  isPast,
  missingCount,
}) {
  if (!meal) {
    return (
      <TouchableOpacity
        onPress={onAdd}
        disabled={isPast}
        className={`bg-gray-50 rounded-xl p-4 mb-3 border-2 border-dashed border-gray-300 flex-row items-center justify-center ${
          isPast ? "opacity-50" : ""
        }`}
      >
        <Text className="text-gray-400 font-semibold">Add {mealType}</Text>
      </TouchableOpacity>
    );
  }

  const statusColor = missingCount === 0 ? "text-green-600" : "text-orange-500";
  const statusText =
    missingCount === 0 ? "All good" : `${missingCount} missing`;

  return (
    <View className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-100 flex-row items-center">
      <Image
        source={getImageSource(meal.image)}
        style={{ width: 50, height: 50, borderRadius: 10 }}
        resizeMode="cover"
      />
      <TouchableOpacity onPress={onPress} className="flex-1 ml-3">
        <Text className="font-semibold text-gray-800">{meal.title}</Text>
      </TouchableOpacity>

      {!isPast && (
        <TouchableOpacity onPress={onRemove} className="p-2">
          <Text className="text-red-400 text-lg font-bold">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
