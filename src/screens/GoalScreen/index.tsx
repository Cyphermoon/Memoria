import { FontAwesome6 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, FlatList, SafeAreaView, View } from 'react-native'
import colors from 'tailwindcss/colors'
import GoalItem from '../../components/Goal/GoalItem'
import Text from '../../components/common/Text'
import Touchable from '../../components/common/Touchable'
import { useSlidePosition } from '../../context/SlidePositionProvider'
import SearchBar from '../../components/common/SearchBar'
import customColors from '../../../colors'
import { RootStackParamList } from '../../../type'
import { GoalItemProps, IntervalOptionProps } from '../../components/Goal/type'
import IntervalSelector from '../../components/Goal/IntervalSelector'
import { intervalOptions } from 'settings'


const goalItems = [
    { id: '1', description: 'Make 50 coffees', imageUrl: 'https://picsum.photos/id/63/200/300' },
    { id: '2', description: 'Read 5 books', imageUrl: 'https://picsum.photos/id/64/200/300' },
    { id: '3', description: 'Run 10 miles', imageUrl: 'https://picsum.photos/id/65/200/300' },
    { id: '4', description: 'Write 3 blog posts', imageUrl: 'https://picsum.photos/id/66/200/300' },
    { id: '5', description: 'Visit 2 new cities', imageUrl: 'https://picsum.photos/id/67/200/300' },
    { id: '6', description: 'Learn a new programming language', imageUrl: 'https://picsum.photos/id/68/200/300' },
    { id: '7', description: 'Cook a new recipe', imageUrl: 'https://picsum.photos/id/69/200/300' },
];


type Props = NativeStackScreenProps<RootStackParamList, "Goal">


const GoalScreen = ({ route, navigation }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const ref = useRef<FlatList<any> | null>(null)
    const { position } = useSlidePosition()

    const [selectedInterval, setSelectedInterval] = useState<IntervalOptionProps>(intervalOptions[0]);

    const handleIntervalSelected = (interval: IntervalOptionProps) => {
        setSelectedInterval(interval);
        // You can add more logic here if needed
    };

    function movetoNewGoalItem() {
        navigation.navigate('NewGoalItem', { goalFolderId: route.params.id })
    }

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
            ? `Are you sure you want to delete "${goalItem.description}"?`
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
        navigation.navigate('GoalSlideShow', { currentId: id, goals: goalItems });
    };

    function handleEdit(goalItem: GoalItemProps) {
        navigation.navigate('EditGoalItem', { goalItem });
    }

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollToIndex({ index: position, animated: true })
        }

    }, [position])

    return (
        <SafeAreaView className='bg-primary flex-grow'>
            <View className='px-1 flex-grow'>

                {/* Header Section */}
                <View className='flex-row justify-between items-center mb-8 mt-6'>
                    <Text className='text-4xl font-semibold'>{route.params.name}</Text>

                    <View className='flex-row items-center'>
                        <IntervalSelector
                            selectedInterval={selectedInterval}
                            handleIntervalSelected={handleIntervalSelected}
                        />

                        <Touchable className='flex-row ml-4' onPress={movetoNewGoalItem}>
                            <FontAwesome6 name="add" size={16} color={colors.gray[800]} />
                            <Text className='text-primary ml-2'>
                                New
                            </Text>
                        </Touchable>
                    </View>
                </View>


                {/* Search Bar */}
                <View className='mb-10'>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchQueryChanged}
                        handleSearchSubmit={handleSearchSubmit} />
                </View>


                {/* Goals List */}
                <View className='flex-grow h-96'>

                    <FlatList
                        ref={ref}
                        data={goalItems}
                        keyExtractor={item => item.id}
                        ListFooterComponent={() => <View className='h-10' />}
                        renderItem={({ item }) => (
                            <View className='relative w-full h-56 rounded-2xl'>
                                <GoalItem
                                    id={item.id}
                                    name={item.description}
                                    url={item.imageUrl}
                                    onDelete={handleDelete}
                                    onFullscreen={handleFullscreen}
                                    onEdit={handleEdit} />
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default GoalScreen