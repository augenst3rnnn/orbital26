import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
