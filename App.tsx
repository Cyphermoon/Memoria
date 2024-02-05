import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AddCollectionModal from './src/modals/AddCollectionModal';
import GoalScreen from './src/screens/GoalScreen';
import { SelectedGoalProps } from './src/components/Home/type';

export type RootStackParamList = {
  onBoarding: undefined
  Splash: undefined
  Auth: undefined
  Home: undefined
  AddCollection: undefined
  Goal: SelectedGoalProps
};

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <GestureHandlerRootView className='flex-grow'>
      <BottomSheetModalProvider>
        <NavigationContainer >
          {/* Creating a navigation stack */}
          <RootStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <RootStack.Group>
              <RootStack.Screen name="Splash" component={SplashScreen} />
              <RootStack.Screen name="onBoarding" component={OnBoardingScreen} />
              <RootStack.Screen name="Auth" component={AuthScreen} />
              <RootStack.Screen name="Home" component={HomeScreen} />
              <RootStack.Screen name="Goal" component={GoalScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ presentation: 'modal' }}>
              <RootStack.Screen name="AddCollection" component={AddCollectionModal} />
            </RootStack.Group>
          </RootStack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
