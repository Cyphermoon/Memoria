import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "@screens/Auth/LoginScreen"
import RegisterScreen from "@screens/Auth/RegisterScreen"
import OnBoardingScreen from "@screens/OnBoardingScreen"
import { AuthStackParamList } from "type"


const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="onBoarding" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="onBoarding" component={OnBoardingScreen} />
            <AuthStack.Screen name="Auth" component={RegisterScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackNavigator