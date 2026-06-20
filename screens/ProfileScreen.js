import {View,Text,TouchableOpacity,TextInput,ActivityIndicator,Alert,ScrollView,Image,FlatList,} from 'react-native';
import React, { useState, useEffect } from 'react';
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

    const [editingName, setEditingName] = useState(false);
    const [displayName, setDisplayName] = useState('');

    //fetch profile on mount
    useEffect(() => {
        fetchProfile();
        fetchFavorites();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = getCurrentUserId();
            const data = await getUserProfile(userId);
            setProfile(data);
            setDisplayName(data?.displayName || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
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

    { /*handle display name update */ }
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

    { /*handle logout */ }
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

    { /*render favorite recipe card */ }
    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-100 flex-row items-center"
            onPress={() => {
                navigation.navigate("RecipeDetails", {
                    recipe: {
                        id: item.id,
                        title: item.title,
                        image: item.image,
                    }
                });
            }}
        >
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/50' }}
                style={{ width: 50, height: 50, borderRadius: 8 }}
            />
            <View className="flex-1 ml-3">
                <Text className="font-semibold text-gray-800" numberOfLines={1}>
                    {item.title}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        'Remove Favorite',
                        `Remove "${item.title}"?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Remove',
                                style: 'destructive',
                                onPress: async () => {
                                    try {
                                        const userId = getCurrentUserId();
                                        await removeFavoriteRecipe(userId, item.id);
                                        setFavorites(favorites.filter(f => f.id !== item.id));
                                    } catch (error) {
                                        Alert.alert('Error', 'Failed to remove');
                                    }
                                }
                            }
                        ]
                    );
                }}
                className="p-2"
            >
                <Text className="text-red-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    {/*render when no favorites */}
    const renderEmptyFavorites = () => (
        <View className="bg-gray-50 rounded-xl p-6 items-center">
            <Text className="text-gray-400">No favorite recipes yet</Text>
        </View>
    );

    {/*render loading state */}
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#eab308" />
            </View>
        );
    }

    {/*profile*/}
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>

                {/* Avatar */}
                <View className="items-center mb-6">
                    <View className="w-20 h-20 rounded-full bg-yellow-100 justify-center items-center border-2 border-yellow-400">
                        <Image
                            source={require('../assets/icons/avatar.png')}
                            style={{ width: 80, height: 80, borderRadius: 40 }}
                        />
                    </View>
                </View>

                {/* Display Name */}
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500">Display Name</Text>
                            {editingName ? (
                                <TextInput
                                    value={displayName}
                                    onChangeText={setDisplayName}
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mt-1"
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

                {/* Email*/}
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <Text className="text-xs text-gray-500">Email</Text>
                    <Text className="text-gray-800 text-base mt-1">{user?.email}</Text>
                </View>

                {/* Favorite Recipes */}
                <View className="mb-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        Favorites ({favorites.length})
                    </Text>
                    {favorites.length > 0 ? (
                        <FlatList
                            data={favorites}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderFavoriteItem}
                            scrollEnabled={false}
                        />
                    ) : (
                        renderEmptyFavorites()
                    )}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="py-3 bg-yellow-400 rounded-xl mb-8">
                    <Text className="text-center font-semibold text-black">Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}