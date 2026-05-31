import Constants from "expo-constants";

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.SPOONACULAR_API_KEY;

if (!SPOONACULAR_API_KEY) {
  console.error('Spoonacular API key not found in app.json');
}

// Helper function to check if a recipe matches dietary preferences
const matchesDietaryPreferences = (recipeTitle, recipeIngredients, dietaryPreferences) => {
  if (!dietaryPreferences || dietaryPreferences.length === 0) 
    return true;
  //put everything in one string to search for forbidden words
  const titleLower = recipeTitle.toLowerCase();
  const ingredientsText = recipeIngredients.map(i => i.name?.toLowerCase() || '').join(' ');
  const combinedText = titleLower + ' ' + ingredientsText;

  const dietRules = {
    vegetarian: (text) => {
      const forbidden = ['chicken', 'beef', 'pork', 'fish', 'lamb', 'turkey', 'meat', 'bacon', 'ham', 'sausage'];
      return !forbidden.some(word => text.includes(word));
    },
    vegan: (text) => {
      const forbidden = ['chicken', 'beef', 'pork', 'fish', 'lamb', 'turkey', 'meat', 'bacon', 'ham', 'sausage',
        'milk', 'cheese', 'egg', 'yogurt', 'butter', 'cream', 'honey'];
      return !forbidden.some(word => text.includes(word));
    },
    glutenFree: (text) => {
      const forbidden = ['wheat', 'flour', 'bread', 'pasta', 'noodle', 'gluten', 'barley', 'rye', 'oat'];
      return !forbidden.some(word => text.includes(word));
    },
    dairyFree: (text) => {
      const forbidden = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'creamy', 'dairy'];
      return !forbidden.some(word => text.includes(word));
    },
    ketogenic: (text) => {
      const forbidden = ['sugar', 'rice', 'pasta', 'bread', 'potato', 'corn', 'wheat', 'flour'];
      return !forbidden.some(word => text.includes(word));
    },
    paleo: (text) => {
      const forbidden = ['dairy', 'grain', 'sugar', 'legume', 'bean', 'peanut', 'soy', 'rice', 'corn'];
      return !forbidden.some(word => text.includes(word));
    },
    halal: (text) => {
      const forbidden = [
      'pork', 'bacon', 'ham', 'sausage', 'pepperoni', 'prosciutto', 'pancetta',
      'gelatin', 'lard', 'alcohol', 'wine', 'beer', 'vodka', 'whiskey', 'rum',
      'blood', 'cooking wine', 'mirin', 'vanilla extract'
      ];
      return !forbidden.some(word => text.includes(word));
    },
  };

  //check if recipe matches all selected dietary preferences
  for (const diet of dietaryPreferences) {
    const rule = dietRules[diet];
    if (rule && !rule(combinedText)) {
      return false;
    }
  }
  return true;
};

export const searchRecipesByIngredients = async (ingredientsList, dietaryPreferences = []) => {
  try {
    if (!ingredientsList || ingredientsList.length === 0) {
      return [];
    }

    const ingredientsString = ingredientsList.join(",");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=30&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal }
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
    const recipeIds = recipes.map(r => r.id).join(',');

    const detailsResponse = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal }
    );

    if (!detailsResponse.ok) {
      // If details fetch fails, return original recipes (no filtering)
      console.warn("Could not fetch recipe details for filtering");
      return recipes;
    }

    const recipesDetails = await detailsResponse.json();

    //create a map of recipe ID to ingredients
    const ingredientsMap = {};
    recipesDetails.forEach(detail => {
      ingredientsMap[detail.id] = detail.extendedIngredients || [];
    });

    //filter recipes by dietary preferences
    const filteredRecipes = recipes.filter(recipe => {
      const recipeIngredients = ingredientsMap[recipe.id] || [];
      return matchesDietaryPreferences(recipe.title, recipeIngredients, dietaryPreferences);
    });

    return filteredRecipes;

  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    throw error;
  }
};