import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    ScrollView,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
    getCurrentUserId,
    getUserProfile,
    updateDisplayName,
    getFavoriteRecipes,
    removeFavoriteRecipe,
} from '../config/firestoreService';
import useAuth from '../config/hooks/useAuth';

export default function ProfileScreen({ navigation }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [editingName, setEditingName] = useState(false);
    const [displayName, setDisplayName] = useState('');

    const fetchProfile = async () => {
        try {
            const userId = getCurrentUserId();
            const data = await getUserProfile(userId);
            setProfile(data);
            setDisplayName(data?.displayName || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const userId = getCurrentUserId();
            const favs = await getFavoriteRecipes(userId);
            setFavorites(favs);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const loadAllData = async () => {
        setLoading(true);
        await fetchProfile();
        await fetchFavorites();
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadAllData();
            return () => {};
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAllData();
        setRefreshing(false);
    };

    const handleSaveName = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        try {
            setSaving(true);
            const userId = getCurrentUserId();
            await updateDisplayName(userId, displayName.trim());
            setProfile({ ...profile, displayName: displayName.trim() });
            setEditingName(false);
            Alert.alert('Success', 'Name updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    }
                }
            ]
        );
    };

    {/*favourite recipes*/}
    const renderFavoriteItem = ({ item, index }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl p-3 mb-3 shadow-sm border border-gray-100 flex-row items-center"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
            }}
            onPress={() => {
                navigation.navigate("RecipeDetails", {
                    recipe: {
                        id: item.id,
                        title: item.title,
                        image: item.image,
                    }
                });
            }}
            activeOpacity={0.7}
        >
            {/* Recipe image*/}
            <View className="relative">
                <Image
                    source={
                        typeof item.image === 'string' 
                        ? { uri: item.image } 
                        : item.image || require('../assets/icons/avatar.png')
                    }
                style={{ width: 60, height: 60, borderRadius: 12 }}
                />
            </View>

            {/*recipe info with date saved*/}
            <View className="flex-1 ml-3">
                <Text className="font-semibold text-gray-800 text-base" numberOfLines={1}>
                    {item.title}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-400">Saved</Text>
                    {item.savedAt && (
                        <Text className="text-xs text-gray-400 ml-2">
                            • {new Date(item.savedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                    )}
                </View>
            </View>

            {/*remove button */}
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        'Remove Favorite',
                        `Remove "${item.title}" from your favorites?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Remove',
                                style: 'destructive',
                                onPress: async () => {
                                    try {
                                        const userId = getCurrentUserId();
                                        await removeFavoriteRecipe(userId, item.id);
                                        await fetchFavorites();
                                    } catch (error) {
                                        Alert.alert('Error', 'Failed to remove');
                                    }
                                }
                            }
                        ]
                    );
                }}
                className="bg-red-50 p-2 rounded-full"
            >
                <Text className="text-red-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    {/* default empty state for favourite recipe section*/}
    const renderEmptyFavorites = () => (
        <View className="bg-gray-50 rounded-2xl p-10 items-center border border-gray-100 border-dashed">
            <Text className="text-gray-400 font-semibold text-lg">No favorites yet</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
                Start saving recipes you love!
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                className="mt-4 bg-yellow-400 px-6 py-2.5 rounded-full"
            >
                <Text className="font-semibold text-gray-800">Explore Recipes</Text>
            </TouchableOpacity>
        </View>
    );

    {/* loading state */}
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#eab308" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header with yellow background */}
                <View className="bg-yellow-400 pt-8 pb-16 px-6">
                    <Text className="text-2xl font-bold text-gray-800">Profile</Text>
                    <Text className="text-gray-700 text-sm">Manage your account</Text>
                </View>

                {/* profile card */}
                <View className="px-6 -mt-10">
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        {/* Avatar */}
                        <View className="items-center -mt-14">
                            <View className="w-24 h-24 rounded-full bg-yellow-100 justify-center items-center border-4 border-white shadow-md">
                                <Image
                                    source={require('../assets/icons/avatar.png')}
                                    style={{ width: 90, height: 90, borderRadius: 45 }}
                                />
                            </View>
                            <Text className="text-xl font-bold text-gray-800 mt-2">
                                {profile?.displayName || 'User'}
                            </Text>
                            <Text className="text-gray-500 text-sm">{user?.email}</Text>
                        </View>

                        {/* Profile statistics (Favourites, Meal Plans) */}
                        <View className="flex-row justify-around mt-4 pt-4 border-t border-gray-100">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-gray-800">
                                    {favorites.length}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Favorites</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-gray-800">
                                    {profile?.mealPlans ? Object.keys(profile.mealPlans).length : 0}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Meal Plans</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Display Name */}
                <View className="px-6 mt-4">
                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">Display Name</Text>
                                {editingName ? (
                                    <TextInput
                                        value={displayName}
                                        onChangeText={setDisplayName}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base mt-1"
                                        placeholder="Enter your name"
                                        autoFocus
                                    />
                                ) : (
                                    <Text className="text-gray-800 text-base mt-1">
                                        {profile?.displayName || 'Not set'}
                                    </Text>
                                )}
                            </View>
                            {!editingName ? (
                                <TouchableOpacity onPress={() => setEditingName(true)}>
                                    <Text className="text-yellow-500 font-medium">Edit</Text>
                                </TouchableOpacity>
                            ) : (
                                <View className="flex-row ml-2 mt-6">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setEditingName(false);
                                            setDisplayName(profile?.displayName || '');
                                        }}
                                        className="bg-gray-200 px-3 py-1.5 rounded-lg mr-2"
                                    >
                                        <Text className="text-gray-700 text-sm">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSaveName}
                                        disabled={saving}
                                        className="bg-yellow-400 px-3 py-1.5 rounded-lg"
                                    >
                                        <Text className="text-gray-800 text-sm font-semibold">
                                            {saving ? 'Saving...' : 'Save'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Email */}
                <View className="px-6 mt-3">
                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-xs text-gray-500">Email</Text>
                        <Text className="text-gray-800 text-base mt-1">{user?.email}</Text>
                    </View>
                </View>

                {/* Favorites Section */}
                <View className="px-6 mt-4 mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                            <Text className="text-lg font-bold text-gray-800">Favorites</Text>
                            <View className="bg-yellow-100 ml-2 px-2.5 py-0.5 rounded-full">
                                <Text className="text-xs font-semibold text-yellow-600">
                                    {favorites.length}
                                </Text>
                            </View>
                        </View>
                        {favorites.length > 0 && (
                            <Text className="text-xs text-gray-400">
                                Tap to view
                            </Text>
                        )}
                    </View>

                    {favorites.length > 0 ? (
                        <FlatList
                            data={favorites}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderFavoriteItem}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        renderEmptyFavorites()
                    )}
                </View>

                {/*logout button*/}
                <View className="px-6 mb-8">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-yellow-300 py-3.5 rounded-xl flex-row justify-center items-center"
                    >
                        <Text className="text-center font-semibold text-black">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}