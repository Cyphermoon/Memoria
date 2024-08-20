import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { Platform } from "react-native"
import BackgroundFetch from "react-native-background-fetch"
import "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootSiblingParent } from "react-native-root-siblings"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RootStackNavigator from "src/navigation/StackNavigator/RootStackNavigator"
import { headlessAndroidWallpaperUpdate } from "src/util/changeWallpaperBackgroundTask/index.util"
import SlidePositionProvider from "./src/context/SlidePositionProvider"

if (Platform.OS === "android") {
	// Register background task
	BackgroundFetch.registerHeadlessTask(headlessAndroidWallpaperUpdate)
}

// Creating a navigation stack
const PERSISTENCE_KEY = "NAVIGATION_STATE_V1"

export default function App() {
	// const [isReady, setIsReady] = useState(__DEV__ ? false : true)
	// const [initialState, setInitialState] = useState()
	// useEffect(() => {
	// 	const restoreState = async () => {
	// 		try {
	// 			const linkingUrl = await Linking.getInitialURL()

	// 			// Do not restore state when there is a deep link
	// 			if (linkingUrl !== null) return

	// 			// retrieve the state from async storage
	// 			const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY)
	// 			const state = savedState ? JSON.parse(savedState) : undefined

	// 			// update initial state if the Asyncstorage has a state
	// 			if (state) {
	// 				setInitialState(state)
	// 			}
	// 		} catch (e: any) {
	// 			console.error("Encountered an error while trying to restore state", e.message)
	// 		} finally {
	// 			// make the app ready irrespective of the outcome
	// 			setIsReady(true)
	// 		}
	// 	}

	// 	if (!isReady) {
	// 		restoreState()
	// 	}
	// }, [isReady])

	// if (!isReady) {
	// 	return <View className="flex-grow bg-red-500" />
	// }

	return (
		<SafeAreaProvider>
			<RootSiblingParent>
				<GestureHandlerRootView className="flex-grow">
					<BottomSheetModalProvider>
						<NavigationContainer
							onStateChange={state => {
								AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
							}}
						>
							<SlidePositionProvider>
								<StatusBar style="light" />
								<RootStackNavigator />
							</SlidePositionProvider>
						</NavigationContainer>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</RootSiblingParent>
		</SafeAreaProvider>
	)
}
