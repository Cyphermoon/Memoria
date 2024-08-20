import Touchable from "@components/common/Touchable"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Image } from "expo-image"
import React, { useCallback, useEffect } from "react"
import { Text, View } from "react-native"
import {
	AddGoalItemModalNavigationProps,
	AddGoalItemModalRouteProps,
} from "src/navigation/screens/GoalScreen/Modals/AddGoalItemModal"
import { ImageGeneratedProps } from "./type"

interface Props {
	imageGenerated: ImageGeneratedProps | null
	setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
}

const UnSplashOption = ({ imageGenerated, setImageGenerated }: Props) => {
	const route = useRoute<AddGoalItemModalRouteProps>()
	const navigation = useNavigation<AddGoalItemModalNavigationProps>()

	const openUnSplashModal = useCallback(() => {
		navigation.navigate("UnSplashModal", {
			editFolderItem: route.params.editFolderItem,
			folder: route.params.folder,
		})
	}, [navigation, route.params.editFolderItem, route.params.folder])

	useEffect(() => {
		// If an image is already selected and the generation method is 'unsplash', do nothing
		if (imageGenerated?.url && imageGenerated?.generationMethod === "unsplash") return

		openUnSplashModal()
	}, [imageGenerated?.generationMethod, imageGenerated?.url, openUnSplashModal])

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Check if there's any new data passed from the UnSplashModal screen Otherwise use the original image
			const originalImageURL = route.params.editFolderItem?.image.secure_url
			const originalGenerationMethod = route.params.editFolderItem?.generationMode

			if (!route.params?.unsplashImage) {
				setImageGenerated({
					url: originalGenerationMethod === "unsplash" ? originalImageURL! : "",
					generationMethod: originalGenerationMethod === "unsplash" ? "unsplash" : "",
				})
			} else {
				setImageGenerated({
					url: route?.params.unsplashImage?.urls?.full,
					generationMethod: "unsplash",
				})
			}
		})

		return () => {
			console.log("UnsplashOption Unmounting")
			unsubscribe()
			// I might need this code when unsplash mode is giving me unexpected issue
		}
	}, [navigation, route.params, setImageGenerated])

	return (
		<View className="flex-grow justify-between items-center space-y-5">
			{imageGenerated?.url && (
				<Image source={imageGenerated.url} contentFit="cover" className="w-full flex-grow rounded-lg" />
			)}

			{!imageGenerated?.url && <Text className="text-gray-400 text-center">No image selected</Text>}
			<Touchable
				onPress={openUnSplashModal}
				variant="muted"
				className="w-full bg-primary-300 flex-row justify-center items-center"
			>
				<Text className="text-gray-400">Choose Another</Text>
			</Touchable>
		</View>
	)
}

export default UnSplashOption
