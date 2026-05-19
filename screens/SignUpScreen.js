
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email, setEmail] =useState('');
    const [password, setPassword] =useState('');
    const handleSubmit = async()=>{
        if (email && password) {
            try{
                await createUserWithEmailAndPassword(auth, email, password);
            }catch(err){
                console.log('got error: ', err.message);
            }
        }
    }
    return (
        <View className="flex-1 bg-white" style={{ backgroundColor: "#9965faff" }}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="bg-yellow-400 p-3 rounded-tr-2xl rounded-bl-2xl ml-4"
                    >
                        <ArrowLeftIcon size="25" color="black" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center">
                    <Image
                        source={require("../assets/images/login.png")}
                        style={{ width: 150, height: 150 }}
                    />
                </View>
            </SafeAreaView>

            <View
                className="flex-1 bg-white px-9 pt-9"
                style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            >
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Full Name</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                        value="john tan"
                        placeholder="Enter your Full Name"
                    />

                    <View className="form space-y-2">
                        <Text className="text-gray-700 ml-4">Email Address</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                            value={email}
                            onChangeText={value=> setEmail(value)}
                            placeholder="Enter your email"
                        />

                        <Text className="text-gray-700 ml-4">Password</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-4"
                            secureTextEntry
                            value={password}
                            onChangeText={value=> setPassword(value)}
                            placeholder="Enter your Password"
                        />

                        <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl" 
                            onPress={handleSubmit}>

                            <Text className="text-center font-bold text-lg">Sign Up </Text>
                        </TouchableOpacity>
                    </View>
                

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-500 font-semibold mt-4"> Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="font-semibold text-yellow-500 mt-4"> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

