import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native'
import SplashScreen from '@screens/SplashScreen'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from 'store/authStore'
import { RootStackParamList } from 'type'

interface Props {
    children: React.ReactNode
}

type RootStackNavigationProp = NavigationProp<RootStackParamList, "AuthNavigator">
const ProtectedScreen = ({ children }: Props) => {
    const [loading, setLoading] = useState(true)

    const userId = useAuthStore(state => state.user?.uid)
    const navigation = useNavigation<RootStackNavigationProp>()
    const isFocused = useIsFocused()

    useEffect(() => {

        if (userId) {
            navigation.navigate('HomeNavigator');
        }

        setLoading(false)
    }, [userId, navigation, isFocused])

    if (loading) {
        return <SplashScreen />
    }

    if (!userId) {
        return (
            <>
                {children}
            </>
        )
    }

}

export default ProtectedScreen