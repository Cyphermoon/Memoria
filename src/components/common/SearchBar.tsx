import { Entypo, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';
import colors from '../../../colors';

interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearchSubmit: () => void;
}


const SearchBar = ({ searchQuery, setSearchQuery, handleSearchSubmit: _handleSearchSubmit }: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const DEFAULT_WIDTH = '100%'
    const searchBarWidth = useSharedValue(DEFAULT_WIDTH);

    // Animation config
    const config = {
        duration: 500,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    // Animation Transition
    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(searchBarWidth.value, config),
        } as DefaultStyle
    });

    function handleFocus(value: boolean) {
        searchBarWidth.value = value ? '80%' : DEFAULT_WIDTH;
        setIsFocused(value);
    }

    function handleSearchChange(query: string) {
        if (searchQuery === '' && query !== '') handleFocus(true);
        setSearchQuery(query);
    }

    function handleSearchSubmit() {
        handleCancelSearch()
        _handleSearchSubmit()
    }

    function handleClearSearch() {
        setSearchQuery('');
        handleFocus(false);
    }

    function handleCancelSearch() {
        Keyboard.dismiss();
        handleFocus(false);
        setSearchQuery('');
    }

    return (
        <View className='flex-row items-center space-x-3'>
            {/* Responsive Search bar */}
            <Animated.View style={animatedStyles} className={`py-1 px-3 border-2 border-secondary rounded-xl flex-row space-x-3 items-center`}>
                <Ionicons name="search-outline" size={26} color={colors.secondary} />

                <TextInput
                    className="flex-grow py-2 text-base text-secondary w-10"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="Search...."
                    placeholderTextColor={colors.secondary}
                    onSubmitEditing={handleSearchSubmit}
                    onFocus={() => handleFocus(true)}
                    onBlur={() => handleFocus(false)}
                />
                {isFocused && searchQuery !== '' &&
                    <Entypo name="cross" size={26} color="#F9FAFB" onPress={handleClearSearch} />
                }
            </Animated.View>
            {
                isFocused &&
                <TouchableOpacity className='py-4' onPress={handleCancelSearch}>
                    <Text className="text-red-300 text-sm text-right">cancel</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

export default SearchBar;