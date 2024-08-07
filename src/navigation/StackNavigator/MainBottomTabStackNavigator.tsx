/* eslint-disable react/no-unstable-nested-components */
import { Ionicons } from "@expo/vector-icons"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import GlobalSearchScreen from "@screens/GlobalSearchScreen"
import colors from "colors"
import { BlurView } from "expo-blur"
import React from "react"
import { StyleSheet } from "react-native"
import { HomeStackParamList } from "type"
import HomeStackNavigator from "./HomeStackNavigator"
import ProfileStackNavigator from "./ProfileStackNavigator"

export type MainBottomTabNavigatorParamList = {
	Home: BottomTabScreenProps<HomeStackParamList>
	Profile: undefined
	Search: undefined
}

// Import your screen components here

const Tab = createBottomTabNavigator<MainBottomTabNavigatorParamList>()

const MainBottomTabNavigator = () => {
	function getIconName(routeName: string, focused: boolean) {
		switch (routeName) {
			case "Home":
				return focused ? "home" : "home-outline"
			case "Profile":
				return focused ? "person" : "person-outline"
			case "Search":
				return focused ? "search" : "search-outline"
			default:
				return "home-outline"
		}
	}

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName: "home" | "home-outline" | "person" | "person-outline" | "search" | "search-outline" =
						getIconName(route.name, focused)

					return <Ionicons name={iconName} size={size} color={color} />
				},
				tabBarActiveTintColor: colors.accent,
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					position: "absolute",
					borderTopWidth: 0,
				},
				headerShown: false,
				tabBarBackground: () => (
					<BlurView tint="dark" intensity={50} style={[StyleSheet.absoluteFill, styles.background]} />
				),
			})}
		>
			<Tab.Screen name="Home" component={HomeStackNavigator} />
			<Tab.Screen name="Search" component={GlobalSearchScreen} />
			<Tab.Screen name="Profile" component={ProfileStackNavigator} />
		</Tab.Navigator>
	)
}

export default MainBottomTabNavigator

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#03071299",
	},
})
