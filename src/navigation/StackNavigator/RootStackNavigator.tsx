import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainBottomTabNavigator from 'src/navigation/StackNavigator/MainBottomTabStackNavigator';
import { RootStackParamList } from 'type';
import AuthStackNavigator from './AuthStackNavigator';


// Create a Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='AuthNavigator'>
            <Stack.Screen name="AuthNavigator" component={AuthStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="HomeNavigator" component={MainBottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
