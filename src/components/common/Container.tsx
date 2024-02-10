import React from 'react'
import { View } from 'react-native'

interface Props {
    children: React.ReactNode
}

const Container = ({ children }: Props) => {
    return (
        <View className={`px-3 flex-grow`}>
            {children}
        </View>
    )
}

export default Container