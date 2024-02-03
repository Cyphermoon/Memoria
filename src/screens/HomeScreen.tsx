import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from '../components/common/Logo'
import { View } from 'react-native'
import UserAvatar from '../components/common/UserAvatar'

const HomeScreen = () => {
    return (
        <SafeAreaView className='flex-grow bg-primary'>
            <View className='flex-row justify-between items-center px-4'>
                <Logo withName size='sm' />
                <UserAvatar username='Cypher_Moon' />
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen