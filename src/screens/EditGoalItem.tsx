import { View } from 'react-native'
import React from 'react'
import Text from '@components/common/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EditGoalItem = () => {
    const insets = useSafeAreaInsets()
    return (
        <View
            className='bg-primary flex-grow justify-center\ items-center'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>
            <Text>To be continued on react in web browser</Text>
        </View>
    )
}

export default EditGoalItem