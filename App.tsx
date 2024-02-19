import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from './colors';
import HeaderCancelButton from './src/components/AddGoalItem/HeaderCancelButton';
import { GoalBackButton } from './src/components/Goal/GoalBackButton';
import Text from './src/components/common/Text';
import SlidePositionProvider from './src/context/SlidePositionProvider';
import AddGoalItemModal from './src/screens/GoalScreen/Modals/AddGoalItemModal';
import GoalSlideShowModal from './src/screens/GoalScreen/Modals/GoalSlideShowModal';
import AuthScreen from './src/screens/AuthScreen';
import GoalScreen from './src/screens/GoalScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import SplashScreen from './src/screens/SplashScreen';
import { RootStackParamList } from './type';
import EditGoalItem from './src/screens/EditGoalItem';
import AddCollectionModal from './src/screens/HomeScreen/Modals/AddCollectionModal';


// Creating a navigation stack
const RootStack = createNativeStackNavigator<RootStackParamList>()

// Define persistence key
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

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
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.primary.DEFAULT },
            headerLeft: () => <GoalBackButton />
          }} />
        <RootStack.Screen
          name="EditGoalItem"
          component={EditGoalItem}
          options={{
            headerShown: false,
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

        <RootStack.Screen
          name='NewGoalItem'
          component={AddGoalItemModal}
          options={{
            headerTitle: () => <Text className='text-xl text-secondary font-medium'>Add Goal</Text>,
            headerBackVisible: false,
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.primary.DEFAULT },
            contentStyle: { flexDirection: 'row', alignItems: 'center' },
            headerRight: () => <HeaderCancelButton />
          }} />
      </RootStack.Group>
    </RootStack.Navigator>
  )

}

export default function App() {
  const [isReady, setIsReady] = useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = useState()

  useEffect(() => {

    const restoreState = async () => {
      try {
        const linkingUrl = await Linking.getInitialURL()

        // Do not restore state when there is a deep link
        // if (linkingUrl !== null) return

        // retrieve the state from async storage
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY)
        const state = savedState ? JSON.parse(savedState) : undefined

        // update initial state if the Asyncstorage has a state
        if (state) {
          setInitialState(state)
        }

      } catch (e: any) {
        console.error('Encountered an error while trying to restore state', e.message)
      }
      finally {
        // make the app ready irrespective of the outcome
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    <Text>App is loading</Text>
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className='flex-grow'>
        <SlidePositionProvider>
          <BottomSheetModalProvider>
            <NavigationContainer
              initialState={initialState}
              onStateChange={(state) => {
                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
              }}>
              {/* Creating a navigation stack */}
              <RootStackNavigation />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </SlidePositionProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
