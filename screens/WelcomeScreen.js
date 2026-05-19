import React from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";


export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1" style={{ flex: 1, backgroundColor: "#faad14" }}>
        <View className="flex-1 justify-around my-4" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text 
                className="text-white font-bold text-4xl text-center"
                style={{ color: "white", fontWeight: "bold", fontSize: 36, textAlign: "center" }}>
                Welcome to CookedLah!
            </Text>

            <View className="flex-row justify-center">
                <Image source={require("../assets/images/burger.png")}
                    style={{width:350, height:380}} />
            </View>

            <View className="space-y-4">
                <TouchableOpacity
                    onPress={()=> navigation.navigate('Signup')}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text className="text-xl font-bold text-center text-gray-700">
                            Sign Up
                        </Text>
                </TouchableOpacity>
            <View className="flex-row justify-center">
                <Text className="text-white font-semibold"> Already have an account?</Text>
                <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                    <Text className="font-semibold text-gray-700"> Log In</Text>
                </TouchableOpacity>     
            </View>   
            </View> 

        </View>
    </SafeAreaView>
  )
}