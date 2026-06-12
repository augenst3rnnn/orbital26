import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ flex: 1, backgroundColor: "#F6F0C9" }}
    >
      <View
        className="flex-1 justify-around my-4"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View className="flex-row justify-center">
          <Image
            source={require("../assets/icons/logo.png")}
            style={{ width: 390, height: 390, resizeMode: "contain" }}
          />
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            className="py-3 bg-yellow-400 mx-1 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Text className="text-gray-700 font-semibold">
              {" "}
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="py-1 px-4 bg-yellow-400 rounded-xl ml-3"
            >
              <Text className="font-semibold text-gray-700"> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
