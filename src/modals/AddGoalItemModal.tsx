import React, { useState } from 'react'
import { TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/common/Text'

const AddGoalItemModal = () => {
    const insets = useSafeAreaInsets()
    const [description, setDescription] = useState('')
    return (
        <View
            className='px-4 flex-grow bg-primary'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>
            <Text className='text-2xl text-secondary text-center font-semibold mt-4'>Add Goal</Text>

            <View className='space-y-2'>
                <Text className='text-lg'>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={3}
                    className='w-full bg-primary-300 rounded-lg p-3 h-28 text-gray-400'
                />
            </View>
        </View>
    )
}

export default AddGoalItemModal