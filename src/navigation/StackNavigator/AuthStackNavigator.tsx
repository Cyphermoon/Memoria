import { useIsFocused } from "@react-navigation/native"
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "@screens/Auth/LoginScreen"
import RegisterScreen from "@screens/Auth/RegisterScreen"
import OnBoardingScreen from "@screens/OnBoardingScreen"
import SplashScreen from "@screens/SplashScreen"
import { useEffect, useState } from "react"
import { useAuthStore } from "store/authStore"
import { AuthStackParamList, RootStackParamList } from "type"


const AuthStack = createNativeStackNavigator<AuthStackParamList>()
type Props = NativeStackScreenProps<RootStackParamList, "AuthNavigator">


const AuthStackNavigator = ({ navigation }: Props) => {
    const user = useAuthStore(state => state.user)
    const isFocused = useIsFocused()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isFocused) return

        // navigate to home if user exists
        if (user) {
            navigation.navigate('HomeNavigator');
        }

        // set loading to false after 2 seconds
        const timeoutRef = setTimeout(() => {
            setLoading(false)
        }, 2000)

        // clear timeout
        return () => clearTimeout(timeoutRef)

    }, [user, isFocused]);


    if (loading) {
        return <SplashScreen />
    }

    return (
        <AuthStack.Navigator initialRouteName="onBoarding" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="onBoarding" component={OnBoardingScreen} />
            <AuthStack.Screen name="Auth" component={RegisterScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackNavigator