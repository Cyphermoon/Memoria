import React from 'react'
import { SafeAreaView, View } from 'react-native'
import Text from '../components/common/Text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import Touchable from '../components/common/Touchable'
import { FontAwesome6 } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'
import Container from '../components/common/Container'
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, "Goal">

const GoalScreen = ({ route }: Props) => {
    return (
        <SafeAreaView className='bg-primary flex-grow'>
            <Container>
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
                </View>
            </Container>
        </SafeAreaView>
    )
}

export default GoalScreen