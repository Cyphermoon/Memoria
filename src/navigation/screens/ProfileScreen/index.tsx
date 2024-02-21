import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@components/common/Text'

const ProfileScreen = () => {
    const insets = useSafeAreaInsets()
    return (
        <View
            className='flex-grow bg-primary px-4'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,

            }}>
            <Text>ProfileScreen</Text>
        </View>
    )
}

export default ProfileScreen