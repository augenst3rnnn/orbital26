import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { getDayName, getDayNumber, isToday } from '../config/services/dateUtils';

export default function WeekCalendar({ weekDates, selectedDate, onSelectDate }) {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="px-4 py-4 bg-white"
        >
            <View className="flex-row">
                {weekDates.map((date) => {
                    const isSelected = date === selectedDate;
                    const today = isToday(date);
                    const dayName = getDayName(date);
                    const dayNumber = getDayNumber(date);
                    
                    return (
                        <TouchableOpacity
                            key={date}
                            onPress={() => onSelectDate(date)}
                            className={`items-center mx-2 px-4 py-2 rounded-xl min-w-[56px] ${
                                isSelected ? 'bg-yellow-200' : 'bg-gray-100'
                            } ${today && !isSelected ? 'border-2 border-yellow-200' : ''}`}
                        >
                            <Text className={`text-xs font-medium ${
                                isSelected ? 'text-gray-800' : 'text-gray-500'
                            }`}>
                                {dayName}
                            </Text>
                            <Text className={`text-lg font-bold ${
                                isSelected ? 'text-gray-800' : 'text-gray-700'
                            }`}>
                                {dayNumber}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}