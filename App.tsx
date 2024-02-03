import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';

export type RootStackParamList = {
  onBoarding: undefined
  Splash: undefined
  Auth: undefined
  Home: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <GestureHandlerRootView className='flex-grow'>
      <NavigationContainer >
        {/* Creating a navigation stack */}
        <Stack.Navigator initialRouteName="Splash" screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="onBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
