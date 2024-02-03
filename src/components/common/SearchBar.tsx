import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Keyboard, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearchSubmit: () => void;
}

const DEFAULT_WIDTH = Dimensions.get('window').width - 30

const SearchBar = ({ searchQuery, setSearchQuery, handleSearchSubmit: _handleSearchSubmit }: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const searchBarWidth = useSharedValue(DEFAULT_WIDTH);

    const config = {
        duration: 500,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(searchBarWidth.value, config),
        };
    });

    function handleFocus(value: boolean) {
        searchBarWidth.value = value ? 330 : DEFAULT_WIDTH;
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
            <Animated.View style={animatedStyles} className={`py-1 px-3 border-2 border-secondary rounded-xl flex-row space-x-3 items-center`}>
                <Ionicons name="search-outline" size={26} color={'#F9FAFB'} />

                <TextInput
                    className="flex-grow py-2 text-base text-secondary w-10"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="Search...."
                    placeholderTextColor={'#F9FAFB'}
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