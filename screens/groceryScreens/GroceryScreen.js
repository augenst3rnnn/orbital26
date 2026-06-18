import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockRecipes } from "../../data/mockRecipes";
import RecipeModal from "../../components/RecipeModal";
import { useDebounce } from "../../config/hooks/useDebounce";

export default function GroceryScreen({ navigation }) {
  const [searchQuery];
}
