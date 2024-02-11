import { FontAwesome6 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { RootStackParamList } from '../../App'
import GoalItem from '../components/Goal/GoalItem'
import ActionSection from '../components/Home/ActionSection'
import Text from '../components/common/Text'
import Touchable from '../components/common/Touchable'
import { Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, "Goal">

const goalItems = [
    { id: '1', name: 'Make 50 coffees', url: 'https://picsum.photos/id/63/200/300' },
    { id: '2', name: 'Read 5 books', url: 'https://picsum.photos/id/64/200/300' },
    { id: '3', name: 'Run 10 miles', url: 'https://picsum.photos/id/65/200/300' },
    { id: '4', name: 'Write 3 blog posts', url: 'https://picsum.photos/id/66/200/300' },
    { id: '5', name: 'Visit 2 new cities', url: 'https://picsum.photos/id/67/200/300' },
    { id: '6', name: 'Learn a new programming language', url: 'https://picsum.photos/id/68/200/300' },
    { id: '7', name: 'Cook a new recipe', url: 'https://picsum.photos/id/69/200/300' },
];

const GoalScreen = ({ route, navigation }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');

    //* Search Actions
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

    //* Goal Items Actions
    function handleDelete(id: string) {
        // Find the goal item by its id
        const goalItem = goalItems.find(item => item.id === id);

        // If the goal item was found, use its name in the alert message
        const message = goalItem
            ? `Are you sure you want to delete "${goalItem.name}"?`
            : "Are you sure you want to delete this goal item?";

        Alert.alert(
            "Delete Goal Item", // Alert title
            message, // Alert message
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        console.log('Delete button pressed');
                        // Add your delete logic here
                    }
                }
            ],
            { cancelable: false }
        );
    };

    function handleFullscreen(id: string) {
        navigation.navigate('GoalSlideShow', { id });

    };

    return (
        <SafeAreaView className='bg-primary flex-grow'>
            <View className='px-1 flex-grow'>
                {/* Header Section */}
                <View className='flex-row justify-between items-center mb-8 mt-6'>
                    <Text className='text-4xl font-semibold'>{route.params.name}</Text>

                    <View className='flex-row items-center'>
                        <Touchable className='flex-row py-3.5' variant='outline'>
                            <FontAwesome6 name="user-clock" size={16} color="#FFAEDC" />
                            <Text className='text-accent ml-2'>
                                Daily
                            </Text>
                        </Touchable>
                        <Touchable className='flex-row ml-4'>
                            <FontAwesome6 name="add" size={16} color={colors.gray[800]} />
                            <Text className='text-primary ml-2'>
                                New
                            </Text>
                        </Touchable>
                    </View>
                </View>


                {/* Action Section */}
                <View className='mb-10'>
                    <ActionSection
                        searchQuery={searchQuery}
                        handleSearchQueryChanged={handleSearchQueryChanged}
                        handleSearchSubmit={handleSearchSubmit}
                        handleSortPress={handleSortPress}
                    />
                </View>


                {/* Goals List */}
                <View className='flex-grow h-96'>
                    <FlatList
                        data={goalItems}
                        keyExtractor={item => item.id}
                        ListFooterComponent={() => <View className='h-10' />}
                        renderItem={({ item }) => (
                            <View className='relative w-full h-56 rounded-2xl'>
                                <GoalItem id={item.id} name={item.name} url={item.url} onDelete={handleDelete} onFullscreen={handleFullscreen} />
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default GoalScreen