import React from "react"
import { SafeAreaView } from "react-native"
import Logo from "../../components/common/Logo"
import Text from "../../components/common/Text"

const SplashScreen = () => {
	return (
		<SafeAreaView className="bg-primary h-screen w-screen flex flex-col justify-center items-center space-y-4">
			<Logo size="lg" />
			<Text className="text-secondary text-lg font-normal">Memoria</Text>
		</SafeAreaView>
	)
}

export default SplashScreen
