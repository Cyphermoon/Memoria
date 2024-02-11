import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoalBackButton } from './src/components/Goal/GoalBackButton';
import { SelectedGoalProps } from './src/components/Home/type';
import AddCollectionModal from './src/modals/AddCollectionModal';
import AuthScreen from './src/screens/AuthScreen';
import GoalScreen from './src/screens/GoalScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import SplashScreen from './src/screens/SplashScreen';
import GoalSlideShowModal from './src/modals/GoalSlideShowModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  onBoarding: undefined
  Splash: undefined
  Auth: undefined
  Home: undefined
  AddCollection: undefined
  Goal: SelectedGoalProps
  GoalSlideShow: { id: string }
};

const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootStackNavigation = () => {
  return (
    <RootStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <RootStack.Group>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="onBoarding" component={OnBoardingScreen} />
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen
          name="Goal"
          component={GoalScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: '#030712' },
            headerLeft: () => <GoalBackButton />
          }} />
      </RootStack.Group>

      <RootStack.Group >
        <RootStack.Screen
          name="AddCollection"
          component={AddCollectionModal}
          options={{ presentation: 'modal' }} />

        <RootStack.Screen
          name="GoalSlideShow"
          component={GoalSlideShowModal}
          options={{
            presentation: 'card',
            headerShown: false,
            animation: "fade",
          }} />
      </RootStack.Group>
    </RootStack.Navigator>
  )

}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className='flex-grow'>
        <BottomSheetModalProvider>
          <NavigationContainer >
            {/* Creating a navigation stack */}
            <RootStackNavigation />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
