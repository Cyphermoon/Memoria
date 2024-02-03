import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { RootStackParamList } from '../../App'
import Logo from '../components/common/Logo'
import Text from '../components/common/Text'

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>

const SplashScreen = ({ navigation }: Props) => {

    // Navigate to onBoarding screen after 3 seconds
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('onBoarding')
        }, 3000)
    }, [])

    return (
        <SafeAreaView className='bg-primary h-screen w-screen flex flex-col justify-center items-center space-y-4'>
            <Logo size='lg' />
            <Text className='text-secondary text-lg font-normal'>Memoria</Text>
        </SafeAreaView>
    )
}

export default SplashScreen