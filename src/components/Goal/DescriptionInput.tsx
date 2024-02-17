import { View, Text, TextInput } from 'react-native'
import React from 'react'
import colors from 'tailwindcss/colors'



interface Props {
    description: string
    setDescription: (description: string) => void
}

const DescriptionInput = ({ description, setDescription }: Props) => {
    return (
        <View className='space-y-3'>
            <Text className="font-medium">Description</Text>

            <TextInput
                placeholder='Enter your goal, task or inspiration here '
                placeholderTextColor={colors.gray[400]}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
                className='w-full bg-primary-300 rounded-lg p-3 h-28 text-gray-300'
            />
        </View>
    )
}

export default DescriptionInput