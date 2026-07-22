import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, Image } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import useAuth from "../config/hooks/useAuth";

import GroceryScreen from "../screens/groceryScreens/GroceryScreen";
import MealPlannerScreen from "../screens/MealPlannerScreens/MealPlannerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ExploreRecipeScreen from "../screens/ExploreRecipeScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";

import InventoryScreen from "../screens/groceryScreens/InventoryScreen";
import MissingIngredientsScreen from "../screens/groceryScreens/MissingIngredientsScreen";
import GroceryListScreen from "../screens/groceryScreens/GroceryListScreen";
import FullIngredientsScreen from "../screens/groceryScreens/FullIngredientsScreen";

import AddMealScreen from "../screens/MealPlannerScreens/AddMealScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="bottomTabs"
            options={{ headerShown: false }}
            component={BottomTabs}
          />
          <Stack.Screen
            name="RecipeDetails"
            options={{ headerShown: false }}
            component={RecipeDetailsScreen}
          />
          {/* add grocery screens*/}
          <Stack.Screen
            name="Inventory"
            options={{ headerShown: false }}
            component={InventoryScreen}
          />
          <Stack.Screen
            name="recipeMissingIngredients"
            options={{ headerShown: false }}
            component={MissingIngredientsScreen}
          />
          <Stack.Screen
            name="groceryList"
            options={{ headerShown: false }}
            component={GroceryListScreen}
          />
          <Stack.Screen
            name="recipeChecklist"
            options={{ headerShown: false }}
            component={FullIngredientsScreen}
          />
          <Stack.Screen
            name="AddMeal"
            component={AddMealScreen}
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="Signup"
            options={{ headerShown: false }}
            component={SignUpScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconImage = "";
            if (route.name == "Home") {
              iconImage = (
                <Image
                  source={require("../assets/icons/home.png")}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            } else if (route.name === "Grocery") {
              iconImage = (
                <Image
                  source={require("../assets/icons/grocery.png")}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            } else if (route.name === "Planner") {
              iconImage = (
                <Image
                  source={require("../assets/icons/planner.png")}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            } else if (route.name === "Profile") {
              iconImage = (
                <Image
                  source={require("../assets/icons/profile.png")}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            } else if (route.name === "Explore") {
              iconImage = (
                <Image
                  source={require("../assets/icons/explore.png")}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            }
            return iconImage;
          },
          tabBarActiveTintColor: "#eab308",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Grocery" component={GroceryScreen} />
        <Tab.Screen name="Explore" component={ExploreRecipeScreen} />
        <Tab.Screen name="Planner" component={MealPlannerScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }
}
