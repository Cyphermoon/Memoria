import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ActionSection from '../components/Home/ActionSection'
import Goal from '../components/Home/Goal'
import Container from '../components/common/Container'
import Logo from '../components/common/Logo'
import Text from '../components/common/Text'
import UserAvatar from '../components/common/UserAvatar'
import { getGreetings } from '../util'
import NewGoal from '../components/Home/NewGoal'

const goals = [
    { text: 'Goal 1', active: true, items: 5 },
    { text: 'Goal 2', active: false, items: 3 },
    { text: 'Goal 3', active: false, items: 7 },
    { text: 'Goal 4', active: false, items: 9 },
    { text: 'Goal 5', active: false, items: 1 },
    { text: 'Goal 6', active: false, items: 3 },
    { text: 'Goal 7', active: false, items: 4 },
    { text: 'Goal 8', active: false, items: 1 },
    { text: 'Goal 9', active: false, items: 5 },
    { text: 'Goal 10', active: false, items: 2 },
    { text: 'Goal 11', active: false, items: 7 },
    { text: 'Goal 12', active: false, items: 8 },
    { text: 'Goal 13', active: false, items: 1 },
    { text: 'Goal 14', active: false, items: 3 },
    { text: 'Goal 15', active: false, items: 9 },
    { text: 'Goal 16', active: false, items: 1 },
    { text: 'Goal 17', active: false, items: 2 },
    { text: 'Goal 18', active: false, items: 3 },
    // More goals...
];


const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQueryChanged = (query: string) => {
        setSearchQuery(query);
        // Add any additional logic for handling search query changes here
    };

    function handleSearchSubmit() {
        console.log("Search submitted! ", searchQuery)
    }

    function handleSortPress(id: string) {
        console.log("Sort Pressed: ", id)
    }


    return (
        <SafeAreaView className='flex-grow bg-primary'>
            <Container>
                <View className='flex-row justify-between items-center mb-8'>
                    <Logo withName size='sm' />
                    <UserAvatar username='Cypher_Moon' />
                </View>

                <Text className='font-semibold text-4xl text-secondary  mb-8'>
                    {getGreetings()}, Cypher
                </Text>

                <ActionSection
                    searchQuery={searchQuery}
                    handleSearchQueryChanged={handleSearchQueryChanged}
                    handleSearchSubmit={handleSearchSubmit}
                    handleSortPress={handleSortPress}
                />

                <View className='mt-8 flex-grow h-96'>
                    <FlatList
                        data={goals}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.container}
                        columnWrapperStyle={styles.columnWrapper}
                        numColumns={2}
                        ListFooterComponent={() => <View className='h-28' />}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Goal
                                    onPress={() => { }}
                                    text={item.text}
                                    active={item.active}
                                    items={item.items}
                                />
                            </View>
                        )}
                    />
                </View>

                <NewGoal />

            </Container>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginBottom: 100
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    item: {
        marginBottom: 10,
    },
});
