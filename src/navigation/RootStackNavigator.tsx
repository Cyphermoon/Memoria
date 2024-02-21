import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'type';
import AuthStackNavigator from './AuthStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';


// Create a Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeNavigator" component={HomeStackNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AuthNavigator" component={AuthStackNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
