import { View, Text as RNText, TextProps } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'

interface Props extends TextProps {
    children: React.ReactNode
}

const Text = ({ className, children, ...rest }: Props) => {
    const [fontsLoaded] = useFonts({
        "Inter": require("../../../assets/fonts/Inter-VariableFont_slnt,wght.ttf")
    })

    if (!fontsLoaded) return null

    return (
        <RNText style={{ fontFamily: "Inter" }} className={`text-secondary ${className}`} {...rest}>{children}</RNText>
    )
}

export default Text