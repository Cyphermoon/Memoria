import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Touchable from '../components/common/Touchable'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, "GoalSlideShow">

const GoalSlideShowModal = ({ navigation }: Props) => {
    return (
        <SafeAreaView className='bg-red-500'>
            <Text>GoalSlideShowModal</Text>
            <Touchable isText onPress={() => navigation.goBack()} >
                Go Back
            </Touchable>
        </SafeAreaView>
    )
}

export default GoalSlideShowModal