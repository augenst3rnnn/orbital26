import {
  Modal,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

export default function RecipeModal({ visible, recipe, onClose, onReadMore }) {
  if (!recipe) return null;
  //handle image source (API returns URL string, mock has local image object)
  const getImageSource = () => {
    if (typeof recipe.image === 'string') {
      return { uri: recipe.image };
    }
    return recipe.image;
  };

  const getSummary = () => {
    if (!recipe.summary) return "A delicious recipe made with your ingredients.";
    return recipe.summary.replace(/<[^>]*>/g, '');
  };

  const getShortSummary = () => {
    const summary = getSummary();
    if (summary.length > 100) {
      return summary.substring(0, 100) + "...";
    }
    return summary;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 bg-gray-200 bg-opacity-10 p-10 justify-center items-center">
        <View className="bg-white rounded-2xl p-8 w-full h-3/4 shadow-lg">
          
          {/*close*/}
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-800 -mt-4 mb-2 -ml-4 text-lg font-bold">✕</Text>
          </TouchableOpacity>

          {/*recipe image */}
          <Image
            source={getImageSource()}
            className="w-full h-64 rounded-lg pb-2"
            resizeMode="cover"
          />

          {/* recipe title */}
          <Text className="text-2xl font-bold mt-2">{recipe.title}</Text>

          <Text className="text-sm text-gray-500 mb-3">{getShortSummary()}</Text>

          <View className="bg-yellow-300 rounded-lg p-3 mb-2">
            <Text className="text-lg font-semibold mb-1 ml-2">Ingredients</Text>
            <Text className="text-gray-700 mb-2 ml-2">
              {recipe.usedIngredientCount || 0} available,{" "}
              {recipe.missedIngredientCount || 0} missing
            </Text>
          </View>

          {/* Read More*/}
          <View className="bg-purple-700 rounded-lg p-4 mt-1 mb-3 justify-center items-center">
            <Pressable
              onPress={() => {
                onReadMore();
                console.log("Clicked read more on: ", recipe.title);
              }}
            >
              <Text className="text-sm text-white font-semibold">
                Read More
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}