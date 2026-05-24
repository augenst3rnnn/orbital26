import Constants from "expo-constants";

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.SPOONACULAR_API_KEY;

if (!SPOONACULAR_API_KEY) {
    console.error('Spoonacular API key not found in app.json');
}

export const searchRecipesByIngredients = async (ingredientsList) => {
    try {
        if (!ingredientsList || ingredientsList.length === 0) {
            return [];
        }

        const ingredientsString = ingredientsList.join(",");

        //cancel operation if too slow (> 10s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=10&apiKey=${SPOONACULAR_API_KEY}`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error fetching recipes: ${response.statusText}`);
        }

        const data = await response.json();

        //validate response is an array
        if (!Array.isArray(data)) {
            throw new Error("Invalid API response format: expected an array");
        }

        return data;
    } catch (error) {
        console.error("Error searching recipes by ingredients:", error);
        throw error;
    }
};
