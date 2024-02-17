import { View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import customColors from '../../../colors'
import Text from '../common/Text'
import { ImageGeneratedProps } from './type'

interface Props {
    description: string
    setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
    ImageGenerated: ImageGeneratedProps | null
}

const AIImageOption = ({ description, setImageGenerated }: Props) => {
    const [loading, setLoading] = useState(true)
    return (
        <View className='space-y-4 flex-grow justify-center items-center'>
            {loading &&
                <ActivityIndicator
                    size="large"
                    color={customColors.secondary} />}

            <Text>Generating Image...</Text>
        </View>
    )
}

export default AIImageOption