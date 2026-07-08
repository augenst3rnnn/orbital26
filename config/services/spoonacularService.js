import Constants from "expo-constants";
import { matchesDietaryPreferences } from "../dietaryFilters";
import { mockRecipes } from "../../data/mockRecipes";
import { getCachedData, setCachedData } from "./cacheService";

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

    const normalizedIngredients = [...ingredientsList]
      .map((item) => item.toLowerCase().trim())
      .sort();

    const normalizedDietary = [...dietaryPreferences]
      .map((item) => item.toLowerCase().trim())
      .sort();

    const cacheKey = `search_${normalizedIngredients.join(",")}_${normalizedDietary.join(",")}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      console.log(`Using cached recipes for ${cacheKey}`);
      return cachedData;
    }

    const ingredientsString = normalizedIngredients.join(",");
    console.log(`Fetching recipes for ${ingredientsString} from API`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=30&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching recipes: ${response.status} ${errorText}`,
      );
    }

    let recipes = await response.json(); //raw API results

    if (!Array.isArray(recipes)) {
      throw new Error("Invalid API response format: expected an array");
    }

    let finalRecipes = recipes; //filtered API results
    if (dietaryPreferences.length > 0) {
      const recipeIds = recipes.map((r) => r.id).join(",");

      const detailsController = new AbortController();
      const detailsTimeoutId = setTimeout(
        () => detailsController.abort(),
        10000,
      );

      const detailsResponse = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${SPOONACULAR_API_KEY}`,
        { signal: detailsController.signal },
      );

      clearTimeout(detailsTimeoutId);

      if (!detailsResponse.ok) {
        console.warn("Could not fetch recipe details for filtering");
      } else {
        const recipesDetails = await detailsResponse.json();

        const ingredientsMap = {};
        recipesDetails.forEach((detail) => {
          ingredientsMap[detail.id] = detail.extendedIngredients || [];
        });

        finalRecipes = recipes.filter((recipe) => {
          const recipeIngredients = ingredientsMap[recipe.id] || [];
          return matchesDietaryPreferences(
            recipe.title,
            recipeIngredients,
            dietaryPreferences,
          );
        });
      }
    }

    await setCachedData(cacheKey, finalRecipes);

    return finalRecipes;
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    throw error;
  }
};

export const fetchRecipeNutrition = async (recipeId) => {
  try {
    if (!recipeId) {
      throw new Error("Recipe ID is required to fetch nutrition information");
    }
    //check if this is a mock recipe
    if (recipeId <= 8) {
      const mockRecipe = mockRecipes.find((r) => r.id === recipeId);
      if (mockRecipe && mockRecipe.nutrition) {
        console.log(`Using mock nutrition for recipe ${recipeId}`);
        return mockRecipe.nutrition;
      }
    }
    //else proceed with real API call
    const cacheKey = `nutrition_${recipeId}`;
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log("Using cached recipe nutrition:", recipeId);
      return cachedData;
    }

    console.log(`Fetching nutrition for recipe ${recipeId} from API`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching recipes: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    const nutrition = {
      calories:
        data.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount ||
        0,
      protein:
        data.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount ||
        0,
      carbs:
        data.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")
          ?.amount || 0,
      fat:
        data.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount || 0,
      fiber:
        data.nutrition?.nutrients?.find((n) => n.name === "Fiber")?.amount || 0,
      healthScore: data.healthScore || 0,
    };

    await setCachedData(cacheKey, nutrition);
    return nutrition;
  } catch (error) {
    console.error("Error fetching recipe nutrition:", error);
    throw error;
  }
};

export const getRecipeDetails = async (recipeId) => {
  try {
    if (!recipeId) {
      throw new Error("Recipe ID is required to fetch nutrition information");
    }
    //check if this is a mock recipe
    if (recipeId <= 8) {
      const mockRecipe = mockRecipes.find((r) => r.id === recipeId);

      if (mockRecipe) {
        return {
          ...mockRecipe,
          instructions: mockRecipe.instructions || [],
          extendedIngredients: mockRecipe.ingredients || [], //follow same shape as real API
        };
      }
    }

    //check cache before calling API
    const cacheKey = `details_${recipeId}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      console.log("Using cached recipe details:", recipeId);
      return cachedData;
    }

    //else, call API
    console.log(`Fetching full details for recipe ${recipeId}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching details: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    //extract full ingredients list
    const extendedIngredients =
      //data.extendedIngredients?.map((ing) => ing.original) || [];
      data.extendedIngredients?.map((ing) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original,
        aisle: ing.aisle || "",
        image: ing.image || "",
      })) || [];

    // extract instructions
    let instructions = [];

    if (data.instructions) {
      // Remove HTML tags
      const cleanInstructions = data.instructions.replace(/<[^>]*>/g, "");

      //split by numbers (1., 2., etc.)
      const regex = /\d+\.\s*/g;
      const parts = cleanInstructions.split(regex);

      if (parts.length > 1) {
        // Remove empty first element and clean up
        instructions = parts.slice(1).map((step) => step.trim());
      } else if (cleanInstructions.length > 0) {
        // If no numbered steps, try splitting by periods
        const sentences = cleanInstructions.split(/\.\s+/);

        if (sentences.length > 1) {
          instructions = sentences.filter((s) => s.length > 10);
        } else {
          instructions = [cleanInstructions];
        }
      }
    }

    if (instructions.length === 0) {
      instructions = ["No detailed instructions available."];
    }

    const recipeDetails = {
      instructions,
      extendedIngredients,
    };

    await setCachedData(cacheKey, recipeDetails);

    return recipeDetails;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return {
      instructions: ["Could not load instructions."],
      extendedIngredients: [],
    };
  }
};

export const searchIngredientByName = async (ingredientName) => {
  const normalizedName = ingredientName.trim().toLowerCase(); //eg, "Milk" and "milk" cached tgt

  try {
    if (!normalizedName) {
      throw new Error("Ingredient name is required");
    }

    const cacheKey = `ingredientName_${normalizedName}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      console.log("Using cached ingredient:", normalizedName);
      return cachedData;
    }

    console.log(`Fetching ingredient data for ${normalizedName} from API`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    {
      /*return array of size 5*/
    }
    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(normalizedName)}&number=5&apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching ingredient: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No ingredient found");
    }

    //data.results is an array of length 5 (bc number = 5)
    const ingredientData = data.results;

    await setCachedData(cacheKey, ingredientData);

    return ingredientData;
  } catch (error) {
    console.error("Error searching ingredient by name:", error);
    throw error;
  }
};

export const getIngredientInformation = async (ingredientId) => {
  try {
    const cacheKey = `ingredientInfo_${ingredientId}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      console.log("Using cached ingredient info");
      return cachedData;
    } else {
      console.log(`Fetching ingredient data for ${ingredientId} from API`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?apiKey=${SPOONACULAR_API_KEY}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching ingredient info: ${response.status} ${errorText}`,
      );
    }

    const ingredientInfo = await response.json();

    await setCachedData(cacheKey, ingredientInfo);

    return ingredientInfo;
  } catch (error) {
    console.error("Error searching for ingredient info:", error);
    throw error;
  }
};

const getIngredientImageURL = (image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `https://img.spoonacular.com/ingredients_100x100/${image}`;
};
