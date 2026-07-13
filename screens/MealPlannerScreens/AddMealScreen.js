import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    FlatList,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { getFavoriteRecipes } from '../../config/firestoreService';

export default function AddMealScreen({ route, navigation }) {
    const { date, mealType, onSelect } = route.params || {};
    
    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    
    const userId = auth.currentUser?.uid;
    
    const dateDisplay = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    
    useEffect(() => {
        if (showFavorites && userId) {
            fetchFavorites();
        }
    }, [showFavorites, userId]);
    
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFavorites(favorites);
        } else {
            const filtered = favorites.filter(recipe =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFavorites(filtered);
        }
    }, [searchQuery, favorites]);
    
    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const favs = await getFavoriteRecipes(userId);
            setFavorites(favs);
            setFilteredFavorites(favs);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSelectFavorite = (recipe) => {
        if (onSelect) {
            const mealRecipe = {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                calories: recipe.calories || 0,
            };
            onSelect(mealRecipe);
            navigation.goBack();
        }
    };
    
    const navigateToHome = () => {
        navigation.goBack();
        navigation.navigate('bottomTabs', { 
            screen: 'Home', 
            params: { 
                returnToPlanner: true, 
                date: date, 
                mealType: mealType,
                onSelect: onSelect 
            } 
        });
    };
    
    const renderMenu = () => (
        <>
            <View className="items-center mb-4">
                <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
                <Text className="text-gray-600 text-lg">← Back</Text>
            </TouchableOpacity>
            
            <Text className="text-2xl font-bold text-gray-800 mb-1">
                Add {mealType?.toLowerCase()}
            </Text>
            
            <Text className="text-gray-500 text-sm mb-6">
                {dateDisplay} — choose how to find a recipe
            </Text>
            
            <TouchableOpacity 
                className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-100 flex-row items-center"
                onPress={navigateToHome}
                activeOpacity={0.7}
            >
                <Image
                    source={require('../../assets/icons/search.png')}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                />
                <View>
                    <Text className="text-lg font-semibold text-gray-800">Search recipes</Text>
                    <Text className="text-sm text-gray-500">Browse by ingredient or name</Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex-row items-center"
                onPress={() => setShowFavorites(true)}
                activeOpacity={0.7}
            >
                <Image
                    source={require('../../assets/icons/favourites.png')}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                />
                <View>
                    <Text className="text-lg font-semibold text-gray-800">From my favorites</Text>
                    <Text className="text-sm text-gray-500">Pick from your saved recipes</Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
                className="bg-white py-4 border-t border-gray-200 items-center mt-auto"
                onPress={() => navigation.goBack()}
            >
                <Text className="text-gray-500 font-medium">Cancel</Text>
            </TouchableOpacity>
        </>
    );
    
    const renderFavorites = () => (
        <>
            <View className="items-center mb-4">
                <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <TouchableOpacity onPress={() => {
                setShowFavorites(false);
                setSearchQuery('');
            }} className="mb-4">
                <Text className="text-gray-600 text-lg">← Back</Text>
            </TouchableOpacity>
            
            <Text className="text-xl font-bold text-gray-800 mb-1">
                Your Favorites
            </Text>
            <Text className="text-gray-500 text-sm mb-4">
                Pick a recipe to add to {mealType?.toLowerCase()}
            </Text>
            
            <View className="bg-gray-100 rounded-xl px-4 py-2 flex-row items-center mb-4">
                <Image
                    source={require('../../assets/icons/search.png')}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <TextInput
                    placeholder="Search your favorites..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 py-2 text-gray-800"
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#eab308" />
                </View>
            ) : filteredFavorites.length > 0 ? (
                <FlatList
                    data={filteredFavorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-gray-50 rounded-xl p-3 mb-3 flex-row items-center border border-gray-100"
                            onPress={() => handleSelectFavorite(item)}
                            activeOpacity={0.7}
                        >
                            {/* fix: Handle both image types */}
                            <Image
                                source={
                                    typeof item.image === 'string' 
                                        ? { uri: item.image } 
                                        : item.image || require('../../assets/icons/avatar.png')
                                }
                                style={{ width: 50, height: 50, borderRadius: 10 }}
                                resizeMode="cover"
                            />
                            <View className="flex-1 ml-3">
                                <Text className="font-semibold text-gray-800">{item.title}</Text>
                            </View>
                            <Text className="text-yellow-500 text-lg font-bold">+</Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    className="mb-20"
                />
            ) : (
                <View className="flex-1 items-center justify-center mt-10">
                    <Text className="text-4xl mb-4">🍽️</Text>
                    <Text className="text-gray-400 text-center text-base">
                        {searchQuery ? 'No matching favorites found' : 'No favorite recipes yet'}
                    </Text>
                    <Text className="text-gray-400 text-sm text-center mt-1">
                        {searchQuery 
                            ? 'Try a different search term' 
                            : 'Save recipes you love from the Home tab!'}
                    </Text>
                    {!searchQuery && (
                        <TouchableOpacity 
                            className="mt-4 bg-yellow-400 px-6 py-2.5 rounded-full"
                            onPress={() => {
                                setShowFavorites(false);
                                navigation.goBack();
                                navigation.navigate('bottomTabs', { screen: 'Home' });
                            }}
                        >
                            <Text className="font-semibold text-gray-800">Discover Recipes</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </>
    );
    
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="slide"
            onRequestClose={() => navigation.goBack()}
        >
            <Pressable 
                className="flex-1 bg-black/50 justify-end"
                onPress={() => navigation.goBack()}
            >
                <Pressable 
                    className="bg-white rounded-t-3xl h-[60%] px-4 pt-4"
                    onPress={(e) => e.stopPropagation()}
                >
                    {showFavorites ? renderFavorites() : renderMenu()}
                </Pressable>
            </Pressable>
        </Modal>
    );
}