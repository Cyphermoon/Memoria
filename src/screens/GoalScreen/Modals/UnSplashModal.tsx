import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchBar from '@components/common/SearchBar'

const UnSplashModal = () => {
    const insets = useSafeAreaInsets()
    const [searchQuery, setSearchQuery] = useState('')

    //* Search Actions
    const handleSearchQueryChanged = (query: string) => {
        setSearchQuery(query);
        // Add any additional logic for handling search query changes here
    };

    function handleSearchSubmit() {
        console.log("Search submitted! ", searchQuery)
    } ('');

    return (
        <View
            className='bg-primary flex-grow px-4 pt-10'
            style={{
                paddingBottom: insets.bottom,
            }}>
            <SearchBar
                variant='filled'
                searchQuery={searchQuery}
                setSearchQuery={handleSearchQueryChanged}
                handleSearchSubmit={handleSearchSubmit} />
        </View>
    )
}

export default UnSplashModal