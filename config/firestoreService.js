import { db, auth} from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";

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
            ...userData
        });
        console.log("User profile created successfully");
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId, userData) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            ...userData,
            updatedAt: new Date()
        });
        console.log("User profile updated successfully");
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

{/*get current authenticated user ID, throw error if no user is logged in*/}

export const getCurrentUserId = () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No user is currently logged in");
    }
    return user.uid;
};

{/*update user display name*/}
export const updateDisplayName = async (userId, displayName) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            displayName: displayName.trim(),
            updatedAt: new Date().toISOString()
        });
        console.log("User display name updated successfully");
    } catch (error) {
        console.error('Error updating user display name:', error);
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
        console.error('Error fetching favorite recipes:', error);
        return [];
    }
};

{/*save a recipe to user's favourites*/}
export const saveFavoriteRecipe = async (userId, recipeId, recipeData) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            favoriteRecipes: arrayUnion({
                id: recipeId,
                title: recipeData.title,
                image: recipeData.image,
                savedAt: new Date().toISOString(),
                summary: recipeData.summary || '',
                ingredients: recipeData.ingredients || [],
                instructions: recipeData.instructions || [],
                readyInMinutes: recipeData.readyInMinutes || 20,
                servings: recipeData.servings || 2,
                likes: recipeData.likes || 0,
                isMock: recipeData.isMock || false,
            })
        });
        console.log("Recipe saved to favorites");
        return { success: true };
    } catch (error) {
        console.error('Error saving favorite recipe:', error);
        throw error;
    }
};

{/*remove user's favourite recipe*/}
export const removeFavoriteRecipe = async (userId, recipeId) => {
    try {
        const userRef = doc(db, "users", userId);
        // Find the favorite entry with matching ID
        const userDoc = await getDoc(userRef);
        const favorites = userDoc.data()?.favoriteRecipes || [];
        const favoriteToRemove = favorites.find(f => f.id === recipeId);
        
        if (favoriteToRemove) {
            await updateDoc(userRef, {
                favoriteRecipes: arrayRemove(favoriteToRemove)
            });
            console.log("Recipe removed from favorites");
        }
        return { success: true };
    } catch (error) {
        console.error('Error removing favorite recipe:', error);
        throw error;
    }
};

{/*get user's profile with error handling*/}
export const getUserProfileWithAuth = async () => {
    try {
        const userId = getCurrentUserId();
        return await getUserProfile(userId);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}; 