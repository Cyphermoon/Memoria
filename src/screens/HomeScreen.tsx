import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from '../components/common/Logo'
import { View } from 'react-native'
import UserAvatar from '../components/common/UserAvatar'
import Text from '../components/common/Text'
import Container from '../components/common/Container'
import { getGreetings } from '../util'
import SearchBar from '../components/common/SearchBar'



const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQueryChanged = (query: string) => {
        setSearchQuery(query);
        // Add any additional logic for handling search query changes here
    };

    function handleSearchSubmit() {
        console.log("Search submitted! ", searchQuery)
        setSearchQuery('');
    }

    return (
        <SafeAreaView className='flex-grow bg-primary'>
            <Container>
                <View className='flex-row justify-between items-center mb-8'>
                    <Logo withName size='sm' />
                    <UserAvatar username='Cypher_Moon' />
                </View>

                <Text className='font-semibold text-4xl text-secondary  mb-10'>
                    {getGreetings()}, Cypher
                </Text>

                {/* Action Section */}
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={handleSearchQueryChanged}
                    handleSearchSubmit={handleSearchSubmit} />
            </Container>
        </SafeAreaView>
    )
}

export default HomeScreen