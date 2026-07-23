 export const dietRules = {
    vegetarian: (text) => {
        const forbidden = ['chicken', 'beef', 'pork', 'fish', 'lamb', 'turkey', 'meat', 'bacon', 'ham', 'sausage'];
        return !forbidden.some(word => text.includes(word));
    },
    vegan: (text) => {
        const forbidden = [
            'chicken', 'beef', 'pork', 'fish', 'lamb', 'turkey', 'meat', 'bacon', 'ham', 'sausage',
            'milk', 'cheese', 'egg', 'yogurt', 'butter', 'cream', 'honey'
        ];
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
        const forbidden = [
            // Dairy
            'milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy',
            // Grains
            'grain', 'wheat', 'flour', 'bread', 'pasta', 'noodle', 'rice', 'corn', 'oat', 'barley', 'rye',
            // Legumes
            'legume', 'bean', 'peanut', 'soy', 'tofu', 'lentil',
            // Sugar
            'sugar', 'honey', 'syrup'
        ];
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

//Helper function to check if a recipe matches dietary preferences
export const matchesDietaryPreferences = (recipeTitle, recipeIngredients, dietaryPreferences) => {
    if (!dietaryPreferences || dietaryPreferences.length === 0) {
        return true;
    }

    // put everything in one string to search for forbidden words
    const titleLower = (recipeTitle || '').toLowerCase();
    const ingredientsText = (recipeIngredients || []).map(i => (i.name || '').toLowerCase()).join(' ');
    const combinedText = titleLower + ' ' + ingredientsText;

    // check if recipe matches all selected dietary preferences
    for (const diet of dietaryPreferences) {
        const rule = dietRules[diet];
        if (rule && !rule(combinedText)) {
            return false;
        }
    }
    return true;
};