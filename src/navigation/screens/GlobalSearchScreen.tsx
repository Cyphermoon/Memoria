import SearchBar from '@components/common/SearchBar';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GlobalSearchScreen = () => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }}
                className='bg-primary px-4 flex-grow'
            >

                <View className='mt-4'>
                    <SearchBar
                        variant='filled'
                        placeholder="Search Personal, Community, Users"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery} />
                </View>


            </View>
        </TouchableWithoutFeedback>

    )
}

export default GlobalSearchScreen;
