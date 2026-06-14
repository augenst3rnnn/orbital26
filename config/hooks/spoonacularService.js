import Constants from "expo-constants";
import { matchesDietaryPreferences } from "../dietaryFilters";

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.SPOONACULAR_API_KEY;

if (!SPOONACULAR_API_KEY) {
  console.error("Spoonacular API key not found in app.json");
}

export const searchRecipesByIngredients = async (
  ingredientsList,
  dietaryPreferences = [],
) => {
  try {
    if (!ingredientsList || ingredientsList.length === 0) {
      return [];
    }

    const ingredientsString = ingredientsList.join(",");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=30&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.statusText}`);
    }

    let recipes = await response.json();

    if (!Array.isArray(recipes)) {
      throw new Error("Invalid API response format: expected an array");
    }

    //if no dietary filters, return all recipes
    if (dietaryPreferences.length === 0) {
      return recipes;
    }

    //for each recipe, get full ingredient list to check dietary compliance
    const recipeIds = recipes.map((r) => r.id).join(",");

    const detailsResponse = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    if (!detailsResponse.ok) {
      // If details fetch fails, return original recipes (no filtering)
      console.warn("Could not fetch recipe details for filtering");
      return recipes;
    }

    const recipesDetails = await detailsResponse.json();

    //create a map of recipe ID to ingredients
    const ingredientsMap = {};
    recipesDetails.forEach((detail) => {
      ingredientsMap[detail.id] = detail.extendedIngredients || [];
    });

    //filter recipes by dietary preferences
    const filteredRecipes = recipes.filter((recipe) => {
      const recipeIngredients = ingredientsMap[recipe.id] || [];
      return matchesDietaryPreferences(
        recipe.title,
        recipeIngredients,
        dietaryPreferences,
      );
    });

    return filteredRecipes;
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    throw error;
  }
};

  export const fetchRecipeNutrition = async (recipeId) => {
  try {
    if (!recipeId) return null;
    
    console.log(`Fetching nutrition for recipe ${recipeId} from API`);
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!response.ok) throw new Error(`Error fetching nutrition: ${response.statusText}`);
    
    const data = await response.json();
    return {
      calories: data.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0,
      protein: data.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount || 0,
      carbs: data.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount || 0,
      fat: data.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount || 0,
      fiber: data.nutrition?.nutrients?.find((n) => n.name === "Fiber")?.amount || 0,
      healthScore: data.healthScore || 0,
    };
  } catch (error) {
    console.error("Error fetching recipe nutrition:", error);
    return null;
  }
};

