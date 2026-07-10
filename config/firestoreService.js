import { db, auth } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No user profile found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      uid: userId,
      email: userData.email,
      displayName: userData.displayName || "",
      createdAt: new Date(),
      ...userData,
    });
    console.log("User profile created successfully");
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date(),
    });
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

{
  /*get current authenticated user ID, throw error if no user is logged in*/
}

export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  return user.uid;
};

{
  /*update user display name*/
}
export const updateDisplayName = async (userId, displayName) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      displayName: displayName.trim(),
      updatedAt: new Date().toISOString(),
    });
    console.log("User display name updated successfully");
  } catch (error) {
    console.error("Error updating user display name:", error);
    throw error;
  }
};

export const getFavoriteRecipes = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data?.favoriteRecipes || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return [];
  }
};

{
  /*save a recipe to user's favourites*/
}

export const saveFavoriteRecipe = async (userId, recipeId, recipeData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      favoriteRecipes: arrayUnion({
        id: recipeId,
        title: recipeData.title,
        image: recipeData.image,
        savedAt: new Date().toISOString(),
        summary: recipeData.summary || "",
        ingredients:
          recipeData.extendedIngredients || recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
        readyInMinutes: recipeData.readyInMinutes || 20,
        servings: recipeData.servings || 2,
        likes: recipeData.likes || 0,
        isMock: recipeData.isMock || false,
      }),
    });
    console.log("Recipe saved to favorites");
    return { success: true };
  } catch (error) {
    console.error("Error saving favorite recipe:", error);
    throw error;
  }
};

{
  /*remove user's favourite recipe*/
}
export const removeFavoriteRecipe = async (userId, recipeId) => {
  try {
    const userRef = doc(db, "users", userId);
    // Find the favorite entry with matching ID
    const userDoc = await getDoc(userRef);
    const favorites = userDoc.data()?.favoriteRecipes || [];
    const favoriteToRemove = favorites.find((f) => f.id === recipeId);

    if (favoriteToRemove) {
      await updateDoc(userRef, {
        favoriteRecipes: arrayRemove(favoriteToRemove),
      });
      console.log("Recipe removed from favorites");
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing favorite recipe:", error);
    throw error;
  }
};

{
  /*get user's profile with error handling*/
}
export const getUserProfileWithAuth = async () => {
  try {
    const userId = getCurrentUserId();
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

{
  /*save an ingredient to user's inventory*/
}
export const saveIngredient = async (
  userId,
  ingredientId,
  ingredientData,
  addAmount = true,
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User document not found");
    }

    const newIngredient = {
      id: ingredientId,
      name: ingredientData.name,
      amount: ingredientData.amount || 0,
      unit: ingredientData.unit || "",
      image: ingredientData.image || "",
      aisle: ingredientData.aisle || "",
      savedAt: new Date().toISOString(),
      expiryDate: ingredientData.expiryDate || "",
    };

    const currentInventory = userSnap.data().ingredientInventory || [];

    {
      /*check if ingredient is alr in inventory */
    }
    const existingIngredient = currentInventory.find(
      (item) => item.id === ingredientId,
    );

    let updatedInventory;

    if (existingIngredient) {
      {
        /*check unit mismatch*/
      }
      if (
        existingIngredient.unit &&
        newIngredient.unit &&
        existingIngredient.unit !== newIngredient.unit
      ) {
        throw new Error("Unit Mismatch!");
      }

      updatedInventory = currentInventory.map((item) => {
        if (item.id === ingredientId) {
          return {
            ...item,
            //add if + (add) button, overwrite if ... (edit) button
            amount: addAmount
              ? Number(item.amount || 0) + Number(newIngredient.amount || 0)
              : Number(newIngredient.amount || 0),
            unit: newIngredient.unit,
            expiryDate: newIngredient.expiryDate,
          };
        }

        return item;
      });
    } else {
      updatedInventory = [...currentInventory, newIngredient];
    }

    await updateDoc(userRef, {
      ingredientInventory: updatedInventory,
    });

    console.log(`Ingredient ${ingredientData.name} saved to inventory`);
    return updatedInventory;
  } catch (error) {
    console.log("Error saving ingredient:", error);
    throw error;
  }
};

{
  /*delete an ingredient from user's infventory*/
}
export const deleteIngredient = async (userId, ingredientToDelete) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const currentInventory = userDoc.data()?.ingredientInventory || [];

    const updatedInventory = currentInventory.filter((ingredient) => {
      return ingredient.id !== ingredientToDelete.id;
    });
    await updateDoc(userRef, {
      ingredientInventory: updatedInventory,
    });

    return updatedInventory;
  } catch (error) {
    console.log("Error deleting ingredient:", error);
    throw error;
  }
};

{
  /*get user's ingredient inventory*/
}
export const getIngredientInventory = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data?.ingredientInventory || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching ingredient inventory:", error);
    return [];
  }
};

{
  /* meal planner functions */
}
export const getMealPlanForWeek = async (userId, weekStart) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const allMealPlans = data?.mealPlans || {};

      const weekDates = getWeekDates(weekStart);
      const weekPlan = {};
      weekDates.forEach((date) => {
        if (allMealPlans[date]) {
          weekPlan[date] = allMealPlans[date];
        } else {
          weekPlan[date] = { breakfast: null, lunch: null, dinner: null };
        }
      });

      return weekPlan;
    }
    return {};
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    return {};
  }
};

{
  /* save meal for a specific day and meal type */
}
export const saveMealForDay = async (userId, date, mealType, recipeData) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    const mealPlans = userDoc.data()?.mealPlans || {};

    if (!mealPlans[date]) {
      mealPlans[date] = { breakfast: null, lunch: null, dinner: null };
    }

    mealPlans[date][mealType] = {
      id: recipeData.id,
      title: recipeData.title,
      image: recipeData.image,
      summary: recipeData.summary || "",
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      readyInMinutes: recipeData.readyInMinutes || 20,
      servings: recipeData.servings || 2,
      calories: recipeData.calories || 0,
      extendedIngredients: recipeData.extendedIngredients || [],
    };

    await updateDoc(userRef, {
      mealPlans: mealPlans,
      updatedAt: new Date().toISOString(),
    });

    console.log(`${mealType} saved for ${date}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving meal:", error);
    throw error;
  }
};

export const removeMealForDay = async (userId, date, mealType) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const mealPlans = userDoc.data()?.mealPlans || {};

    if (mealPlans[date]) {
      mealPlans[date][mealType] = null;
      await updateDoc(userRef, {
        mealPlans: mealPlans,
        updatedAt: new Date().toISOString(),
      });
      console.log(`${mealType} removed for ${date}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing meal:", error);
    throw error;
  }
};

//helper functions to get week start date and all dates in the week
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
};

const getWeekDates = (weekStart) => {
  const dates = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};
