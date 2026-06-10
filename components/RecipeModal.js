import {
  Modal,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

export default function RecipeModal({ visible, recipe, onClose, onReadMore }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 bg-gray-200 bg-opacity-10 p-10 justify-center items-center">
        <View className="bg-white rounded-3xl p-10 w-full w-11/12 shadow-lg">
          <Image
            source={recipe?.image}
            className="w-full h-64 rounded-lg pb-2"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold">{recipe?.title}</Text>
          <Text className="text-sm text-gray-500 mb-4">{recipe?.summary}</Text>
          <View className="bg-yellow-300 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold mb-2">Ingredients</Text>
            <Text className="text-gray-700 mb-4">
              {recipe?.usedIngredientCount} available,{" "}
              {recipe?.missedIngredientCount} missing
            </Text>
          </View>

          <View className="bg-purple-700 rounded-lg p-4 mt-3 mb-4 self-start">
            <Pressable onPress={onReadMore}>
              <Text className="text-xs text-white font-semibold">
                Read More
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose}>
            <Text className="underline text-gray-600">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
