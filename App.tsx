import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStackNavigator from 'src/navigation/RootStackNavigator';
import Text from './src/components/common/Text';
import SlidePositionProvider from './src/context/SlidePositionProvider';


// Creating a navigation stack

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';


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
              <RootStackNavigator />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </SlidePositionProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
