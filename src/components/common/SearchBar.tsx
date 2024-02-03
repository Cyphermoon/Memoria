import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Text from './Text';


interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearchSubmit: () => void
}

const SearchBar = ({ searchQuery, setSearchQuery, handleSearchSubmit }: Props) => {
    const [isFocused, setIsFocused] = useState(false);

    function handleSearchChange(query: string) {
        if (searchQuery === '' && query !== '') setIsFocused(true);
        setSearchQuery(query);
    }

    function handleClearSearch() {
        setSearchQuery('');
        setIsFocused(false);
    }

    function handleCancelSearch() {
        Keyboard.dismiss();
        setIsFocused(false);
        setSearchQuery('');
    }

    return (
        <View className='flex-row items-center space-x-3'>
            <View className={`py-1 px-3 border-2 border-secondary rounded-full flex-row space-x-3 items-center ${isFocused ? "w-80" : "w-full"}`}>
                <Ionicons name="search-outline" size={26} color={'#F9FAFB'} />

                <TextInput
                    className="flex-grow py-2 text-base text-secondary w-10"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="Search...."
                    placeholderTextColor={'#F9FAFB'}
                    onSubmitEditing={handleSearchSubmit}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {isFocused && searchQuery !== '' &&
                    <Entypo name="cross" size={26} color="#F9FAFB" onPress={handleClearSearch} />
                }
            </View>
            {
                isFocused &&
                <TouchableOpacity onPress={handleCancelSearch}>
                    <Text className="text-secondary text-sm text-right">cancel</Text>
                </TouchableOpacity>

            }

        </View>

    );
};

export default SearchBar;