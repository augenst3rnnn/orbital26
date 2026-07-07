import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Alert, 
    RefreshControl,
    ActivityIndicator 
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import { 
    getMealPlanForWeek, 
    saveMealForDay, 
    removeMealForDay 
} from '../../config/firestoreService';
import WeekCalendar from '../../components/WeekCalendar';
import MealCard from '../../components/MealCard';

//helper functions for date comparisons
const isPastDate = (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date < today;
};

const isToday = (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
};

const formatDateDisplay = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
};

const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
};

const getWeekDates = (weekStart) => {
    const dates = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

export default function MealPlannerScreen({ navigation }) {
    const [mealPlan, setMealPlan] = useState({});
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const userId = auth.currentUser?.uid;
    
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchWeekPlan();
            }
        }, [userId, selectedDate])
    );
    
    const fetchWeekPlan = async () => {
        try {
            setLoading(true);
            const weekStart = getWeekStart(selectedDate);
            const dates = getWeekDates(weekStart);
            setWeekDates(dates);
            const plan = await getMealPlanForWeek(userId, weekStart);
            setMealPlan(plan);
        } catch (error) {
            console.error('Error fetching week plan:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWeekPlan();
        setRefreshing(false);
    };
    
    const dayMeals = mealPlan[selectedDate] || { breakfast: null, lunch: null, dinner: null };
    const isPast = isPastDate(selectedDate);
    const isSelectedToday = isToday(selectedDate);
    
    const handleAddMeal = (mealType) => {
        if (isPast) {
            Alert.alert('Cannot Edit', 'You cannot add meals to past dates.');
            return;
        }
        navigation.navigate('AddMeal', { 
            date: selectedDate, 
            mealType: mealType,
            onSelect: (recipe) => {
                saveMealForDay(userId, selectedDate, mealType.toLowerCase(), recipe)
                    .then(() => {
                        fetchWeekPlan();
                    })
                    .catch((error) => {
                        console.error('Error saving meal:', error);
                        Alert.alert('Error', 'Failed to save meal');
                    });
            }
        });
    };
    
    const handleRemoveMeal = (mealType, mealTitle) => {
        if (isPast) {
            Alert.alert('Cannot Edit', 'You cannot remove meals from past dates.');
            return;
        }
        
        Alert.alert(
            'Remove Meal',
            `Remove "${mealTitle}" from ${mealType}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: async () => {
                        await removeMealForDay(userId, selectedDate, mealType.toLowerCase());
                        fetchWeekPlan();
                    }
                }
            ]
        );
    };
    
    const getDateLabel = () => {
        const display = formatDateDisplay(selectedDate);
        if (isSelectedToday) return `${display} • Today`;
        if (isPast) return `${display} • Past day`;
        return display;
    };
    
    const weekGlance = weekDates.map(date => {
        const plan = mealPlan[date] || {};
        // Check if all three meals exist (breakfast, lunch, and dinner)
        const hasAllMeals = !!(plan.breakfast && plan.lunch && plan.dinner);
        // Check if any meal exists (for partial completion)
        const hasAnyMeals = !!(plan.breakfast || plan.lunch || plan.dinner);
        return {
            date,
            hasAllMeals: hasAllMeals,
            hasAnyMeals: hasAnyMeals,
            isToday: isToday(date)
        };
    });
    
    const missingItemsCount = 5; //placeholder for missing items count - will connect to grocery list later
    
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#eab308" />
            </View>
        );
    }
    
    return (
        <View className="flex-1 bg-white">
            {/* yellow header */}
            <View className="bg-yellow-200 pt-20 pb-20 px-6">
                <Text className="text-3xl font-bold pt-10 text-gray-800">Meal planner</Text>
                <Text className="text-gray-700 pt-2 text-md">Plan your week ahead</Text>
            </View>

            <SafeAreaView className="flex-1 bg-white -mt-10 rounded-t-[40px]">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >   
                    {/* week calendar*/}
                    <WeekCalendar
                        weekDates={weekDates}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                    
                    {/* day content */}
                    <View className="px-4 pt-2 pb-8 bg-gray-50">
                        {/* date label */}
                        <Text className="text-lg font-bold text-gray-800">
                            {getDateLabel()}
                        </Text>
                        {/* past day warning - cannot add meals for days that have passed */}
                        {isPast && (
                            <View className="bg-gray-100 rounded-xl p-4 mt-3 items-center">
                                <Text className="text-gray-500 text-center text-sm">
                                    Past days are view-only. You can't edit or add meals.
                                </Text>
                            </View>
                        )}
                        
                        {/* breakfast */}
                        <Text className="text-md font-bold text-gray-400 mt-4 mb-2 tracking-wider">Breakfast</Text>
                        <MealCard
                            meal={dayMeals.breakfast}
                            mealType="Breakfast"
                            onPress={() => {
                                if (dayMeals.breakfast) {
                                    navigation.navigate('RecipeDetails', { 
                                        recipe: {
                                            id: dayMeals.breakfast.id || dayMeals.breakfast.recipeId,
                                            title: dayMeals.breakfast.title,
                                            image: dayMeals.breakfast.image,
                                            summary: dayMeals.breakfast.summary || '',
                                            ingredients: dayMeals.breakfast.ingredients || [],
                                            instructions: dayMeals.breakfast.instructions || [],
                                            readyInMinutes: dayMeals.breakfast.readyInMinutes || 20,
                                            servings: dayMeals.breakfast.servings || 2,
                                            calories: dayMeals.breakfast.calories || 0,
                                            extendedIngredients: dayMeals.breakfast.extendedIngredients || [],
                                        }
                                    });
                                }
                            }}
                            onAdd={() => handleAddMeal('Breakfast')}
                            onRemove={() => handleRemoveMeal('Breakfast', dayMeals.breakfast?.title)}
                            isPast={isPast}
                        />
                        
                        {/* lunch */}
                        <Text className="text-md font-bold text-gray-400 mt-2 mb-2 tracking-wider">Lunch</Text>
                        <MealCard
                            meal={dayMeals.lunch}
                            mealType="Lunch"
                            onPress={() => {
                                if (dayMeals.lunch) {
                                    navigation.navigate('RecipeDetails', { 
                                        recipe: {
                                            id: dayMeals.lunch.id || dayMeals.lunch.recipeId,
                                            title: dayMeals.lunch.title,
                                            image: dayMeals.lunch.image,
                                            summary: dayMeals.lunch.summary || '',
                                            ingredients: dayMeals.lunch.ingredients || [],
                                            instructions: dayMeals.lunch.instructions || [],
                                            readyInMinutes: dayMeals.lunch.readyInMinutes || 20,
                                            servings: dayMeals.lunch.servings || 2,
                                            calories: dayMeals.lunch.calories || 0,
                                            extendedIngredients: dayMeals.lunch.extendedIngredients || [],
                                        }
                                    });
                                }
                            }}
                            onAdd={() => handleAddMeal('Lunch')}
                            onRemove={() => handleRemoveMeal('Lunch', dayMeals.lunch?.title)}
                            isPast={isPast}
                        />
                        
                        {/* dinner */}
                        <Text className="text-md font-bold text-gray-400 mt-2 mb-2 tracking-wider">Dinner</Text>
                        <MealCard
                            meal={dayMeals.dinner}
                            mealType="Dinner"
                            onPress={() => {
                                if (dayMeals.dinner) {
                                    navigation.navigate('RecipeDetails', { 
                                        recipe: {
                                            id: dayMeals.dinner.id || dayMeals.dinner.recipeId,
                                            title: dayMeals.dinner.title,
                                            image: dayMeals.dinner.image,
                                            summary: dayMeals.dinner.summary || '',
                                            ingredients: dayMeals.dinner.ingredients || [],
                                            instructions: dayMeals.dinner.instructions || [],
                                            readyInMinutes: dayMeals.dinner.readyInMinutes || 20,
                                            servings: dayMeals.dinner.servings || 2,
                                            calories: dayMeals.dinner.calories || 0,
                                            extendedIngredients: dayMeals.dinner.extendedIngredients || [],
                                        }
                                    });
                                }
                            }}
                            onAdd={() => handleAddMeal('Dinner')}
                            onRemove={() => handleRemoveMeal('Dinner', dayMeals.dinner?.title)}
                            isPast={isPast}
                        />
                        
                        {/* missing ingredients */}
                        <TouchableOpacity 
                            className="bg-yellow-50 rounded-xl p-4 mt-4 flex-row justify-between items-center border border-yellow-100"
                            onPress={() => {
                                console.log('Navigate to grocery list with missing items');
                            }}
                        >
                            <Text className="text-gray-700 font-semibold">
                                {missingItemsCount} items missing this week
                            </Text>
                            <Text className="text-yellow-600 font-medium">Tap to add →</Text>
                        </TouchableOpacity>
                        
                        {/* week at a glance */}
                        <View className="mt-5">
                            <Text className="text-md font-semibold text-gray-400 mb-3 tracking-wider">Week at a glance</Text>
                            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <View className="flex-row justify-around">
                                    {weekGlance.map((day, index) => (
                                        <View key={day.date} className="items-center">
                                            <Text className={`text-xs font-medium ${
                                                day.isToday ? 'text-yellow-400' : 'text-gray-400'
                                            }`}>
                                                {['M','T','W','T','F','S','S'][index]}
                                            </Text>
                                            <View className={`w-8 h-8 rounded-full mt-1 items-center justify-center ${
                                                day.hasAllMeals ? 'bg-green-100' : day.hasAnyMeals ? 'bg-yellow-100' : 'bg-gray-100'
                                            } ${day.isToday ? 'border-2 border-yellow-200' : ''}`}>
                                                {day.hasAllMeals ? (
                                                    <Text className="text-green-600 text-xs">✓</Text>
                                                ) : day.hasAnyMeals ? (
                                                    <Text className="text-yellow-600 text-xs">~</Text>
                                                ) : null}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}