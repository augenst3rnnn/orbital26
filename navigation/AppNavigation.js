import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, Image } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import useAuth from '../config/hooks/useAuth';

import GroceryScreen from '../screens/GroceryScreen';
import MealPlannerScreen from '../screens/MealPlannerScreen';
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    const {user} = useAuth();
    if(user){
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="bottomTabs" options ={{headerShown: false}} component={BottomTabs} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }else{
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" options ={{headerShown: false}} component={WelcomeScreen} />
                    <Stack.Screen name="Login" options ={{headerShown: false}} component={LoginScreen} />
                    <Stack.Screen name="Signup" options ={{headerShown: false}} component={SignUpScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    function BottomTabs() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size}) => {
                        let iconName = '';
                        if (route.name == 'Home') {
                            iconName = <Image source={require('../assets/images/explore.png')} style={{ width: size, height: size, tintColor: color }} />;
                        } else if (route.name === 'Grocery') {
                            iconName = <Image source={require('../assets/images/grocery.png')} style={{ width: size, height: size, tintColor: color }} />;
                        } else if (route.name === 'Planner') {
                            iconName = <Image source={require('../assets/images/planner.png')} style={{ width: size, height: size, tintColor: color }} />;
                        } else if (route.name === 'Profile') {
                            iconName = <Image source={require('../assets/images/profile.png')} style={{ width: size, height: size, tintColor: color }} />;
                        }
                        return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
                    },
                    tabBarActiveTintColor: '#eab308',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 60,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Grocery" component={GroceryScreen} />
                <Tab.Screen name="Planner" component={MealPlannerScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        );
    }
}