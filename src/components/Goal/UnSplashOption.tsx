import { View, Text } from 'react-native'
import React from 'react'
import { ImageGeneratedProps } from './type'

interface Props {
    imageGenerated: ImageGeneratedProps | null
    setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
}

const UnSplashOption = ({ imageGenerated, setImageGenerated }: Props) => {
    return (
        <View>
            <Text>UnSplashOption</Text>
        </View>
    )
}

export default UnSplashOption