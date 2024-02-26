import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@components/common/Text'

const TestScreen = () => {
    const inset = useSafeAreaInsets()
    return (
        <View
            style={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
            className='flex-grow bg-primary items-center justify-center'>
            <Text>TestScreen</Text>
        </View>
    )
}

export default TestScreen