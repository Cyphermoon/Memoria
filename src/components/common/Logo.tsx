import { useFonts } from 'expo-font'
import React from 'react'
import Text from './Text'
import { StyleSheet, TextProps, View } from 'react-native'

interface Props {
    size?: "lg" | "md" | "sm"
    withName?: boolean
}

const Logo = ({ size = "sm", withName }: Props) => {
    const [fontsLoaded] = useFonts({
        "Keania_One": require("../../../assets/fonts/KeaniaOne-Regular.ttf")
    })

    if (!fontsLoaded) return null


    const logoStyle: TextProps["style"] = {
        ...styles.logo,
        ...(size === "lg" && { fontSize: 120, fontWeight: "400" }),
        ...(size === "md" && { fontSize: 48, fontWeight: "400" }),
        ...(size === "sm" && { fontSize: 25, fontWeight: "400" }),
    }

    const nameStyle: TextProps["style"] = {
        ...(size === "lg" && { fontSize: 40, fontWeight: "700" }),
        ...(size === "md" && { fontSize: 36, fontWeight: "600" }),
        ...(size === "sm" && { fontSize: 16, fontWeight: "300" }),
    }

    return (
        <View className={`flex flex-row items-center justify-center ${size === "sm" ? "space-x-1" : "space-x-2"}`}>
            <Text style={logoStyle}>M</Text>
            {withName && <Text style={nameStyle}>Memoria</Text>}
        </View>
    )
}

export default Logo


const styles = StyleSheet.create({
    logo: {
        fontFamily: "Keania_One",
    }
})