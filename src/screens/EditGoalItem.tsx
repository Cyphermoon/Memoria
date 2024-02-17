import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/common/Text'

const EditGoalItem = () => {
    const insets = useSafeAreaInsets()

    return (
        <View
            className='bg-primary flex-grow'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,

            }}>
            <Text>EditGoalItem</Text>
        </View>
    )
}

export default EditGoalItem