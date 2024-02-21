import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AuthScreen from "@screens/AuthScreen"
import OnBoardingScreen from "@screens/OnBoardingScreen"
import SplashScreen from "@screens/SplashScreen"
import { AuthStackParamList } from "type"


const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Splash" component={SplashScreen} />
            <AuthStack.Screen name="onBoarding" component={OnBoardingScreen} />
            <AuthStack.Screen name="Auth" component={AuthScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackNavigator