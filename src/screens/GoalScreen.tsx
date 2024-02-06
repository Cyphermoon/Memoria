import { FontAwesome6 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { RootStackParamList } from '../../App'
import Container from '../components/common/Container'
import Text from '../components/common/Text'
import Touchable from '../components/common/Touchable'
import { Ionicons } from '@expo/vector-icons'
import ActionSection from '../components/Home/ActionSection'

type Props = NativeStackScreenProps<RootStackParamList, "Goal">

const GoalScreen = ({ navigation, route }: Props) => {
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
        <SafeAreaView className='bg-primary flex-grow'>
            <Container>
                <View className='mb-8'>
                    <TouchableOpacity className='flex-row pb-1 space-x-1 items-start justify-start border-b border-secondary bg-red-500' onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={16} color={colors.gray[300]} />
                        <Text>{route.params.name}</Text>
                    </TouchableOpacity>
                </View>
                {/* Header Section */}
                <View className='flex flex-row justify-between items-center'>
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

                    {/* Action Section */}

                    <ActionSection
                        searchQuery={searchQuery}
                        handleSearchQueryChanged={handleSearchQueryChanged}
                        handleSearchSubmit={handleSearchSubmit}
                        handleSortPress={handleSortPress}
                    />
                </View>
            </Container>
        </SafeAreaView>
    )
}

export default GoalScreen