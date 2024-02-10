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
import { Image } from 'expo-image'
import { MaterialIcons } from '@expo/vector-icons';

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
                {/* Header Section */}
                <View className='flex-row justify-between items-start mb-8 mt-6'>
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
                <View className='relative'>
                    <Image source={"https://picsum.photos/id/237/200/300"} className="w-60 h-40" />
                    <View className='bg-black bg-opacity-30 bottom-0 left-0 w-full flex-row justify-end space-x-3'>
                        <MaterialIcons name="fullscreen" size={24} color="white" />
                        <MaterialIcons name="delete" size={24} color="white" />
                    </View>
                </View>
            </Container>
        </SafeAreaView>
    )
}

export default GoalScreen