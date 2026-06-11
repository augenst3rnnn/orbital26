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
        <View className="bg-white rounded-2xl p-8 w-full h-3/4 shadow-lg">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-800 -mt-4 mb-2 -ml-4">X</Text>
          </TouchableOpacity>

          <Image
            source={recipe?.image}
            className="w-full h-64 rounded-lg pb-2"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold">{recipe?.title}</Text>
          <Text className="text-sm text-gray-500 mb-3">{recipe?.summary}</Text>
          <View className="bg-yellow-300 rounded-lg p-3 mb-2">
            <Text className="text-lg font-semibold mb-1 ml-2">Ingredients</Text>
            <Text className="text-gray-700 mb-2 ml-2">
              {recipe?.usedIngredientCount} available,{" "}
              {recipe?.missedIngredientCount} missing
            </Text>
          </View>

          <View className="bg-purple-700 rounded-lg p-4 mt-1 mb-3 justify-center items-center">
            <Pressable
              onPress={() => {
                onReadMore();
                console.log("Clicked read more on: ", recipe.title);
              }}
            >
              <Text className="text-xs text-white font-semibold">
                Read More
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
