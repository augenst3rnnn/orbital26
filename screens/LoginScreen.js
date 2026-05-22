
import React, { use } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] =useState('');
    const [password, setPassword] =useState('');
    const handleSubmit = async()=>{
        if (email && password) {
            try{
                await signInWithEmailAndPassword(auth, email, password);
            }catch(err){
                    console.log('got error: ', err.message);
            }
        }
    }
  return (
    <View className="flex-1 bg-white" style={{backgroundColor:  "#F6F0C9"}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity
                onPress={()=> navigation.goBack()}
                className="bg-yellow-400 p-3 rounded-tr-2xl rounded-bl-2xl ml-4">    
                <ArrowLeftIcon size="25" color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
            <Image source={require("../assets/images/login.png")}
                style={{width:250, height:250}} />  
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-9 pt-9"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
        >
        <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                placeholder="Enter your email"
                //from sign up screen
                value={email}
                onChangeText={value=> setEmail(value)}
            />

            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                secureTextEntry
                placeholder="Enter your Password"
                //from sign up screen
                value={password} //at least 6 characters
                onChangeText={value=> setPassword(value)}
            />
            <TouchableOpacity className="flex items-end mb-5">
                <Text className="text-gray-700">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSubmit}
                className="py-3 bg-yellow-400 rounded-xl"
            >
                <Text className="text-center font-bold text-lg">
                    Login </Text>
            </TouchableOpacity>
            </View>
        
            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-500 font-semibold"> Don't have an account?</Text>
                <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
                    <Text className="font-semibold text-yellow-500"> Sign Up</Text>
                </TouchableOpacity>     
            </View>
        </View>
    </View>
  );
}

