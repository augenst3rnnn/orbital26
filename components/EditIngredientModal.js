import {
  Modal,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

export default function RecipeModal({ visible, ingredient, onClose, onSave }) {
  if (!ingredient) {
    return null;
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      {/*dark bg overlay*/}
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[40px] px-6 pt-5 pb-10 max-h-[80%]">
          {/*close*/}
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
                source={ingredient.image}
                className="w-32 h-32"
                resizeMode="cover"
              />

              <Text className="text-xl font-bold">{ingredient.name}</Text>
            </View>

            {/*amount & expiry*/}
            <View className="w-full mt-4 mb-4">
              <Text className="font-semibold text-purple-800 text-xs items-start pl-3 mb-2">
                Amount ({ingredient.unit})
              </Text>
              <View className="bg-purple-200 rounded-lg p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold">
                    {ingredient.amount}
                  </Text>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/icons/dropdown.png")}
                      style={{ width: 30, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="w-full mt-4 mb-4">
              <Text className="font-semibold text-purple-800 text-xs items-start pl-3 mb-2">
                Expiry
              </Text>
              <View className="bg-purple-200 rounded-lg p-4">
                <View className="flex-row items-center justify-between">
                  <Text>Exp. in {ingredient.expiryDays} days</Text>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/icons/dropdown.png")}
                      style={{ width: 30, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/*delete & save changes buttons*/}
          <View className="flex-row items-center justify-center gap-3 mt-2">
            <View className="border-2 border-purple-700 rounded-lg px-10 pt-4 pb-4">
              <TouchableOpacity>
                <Text className="font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-purple-700 rounded-lg px-4 pt-4 pb-4">
              <TouchableOpacity
                onPress={() => {
                  onSave();
                  console.log("Saved changes to: ", ingredient.name);
                }}
              >
                <Text className="text-white font-semibold">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
