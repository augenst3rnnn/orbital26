import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchRecipeNutrition } from '../config/hooks/spoonacularService';

const NutritionSection = ({ recipeId }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <View>
    </View>
  );
};

export default NutritionSection;
