import { useFonts } from 'expo-font'
import React from 'react'
import Text from './Text'

const Logo = () => {
    const [fontsLoaded] = useFonts({
        "Keania_One": require("../../../assets/fonts/KeaniaOne-Regular.ttf")
    })

    if (!fontsLoaded) return null

    return (
        <Text style={{ fontFamily: "Keania_One", fontSize: 96, fontWeight: "400" }}>M</Text>
    )
}

export default Logo