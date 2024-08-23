import Touchable from "@components/common/Touchable"
import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { Text, View } from "react-native"
import {
	AddGoalItemModalNavigationProps,
	AddGoalItemModalRouteProps,
} from "src/navigation/screens/GoalScreen/Modals/AddGoalItemModal"
import { useUnSplashImageStore } from "store/unsplashImage"
import GenerationOptionImage from "./GenerationOptionImage"
import { ImageGeneratedProps } from "./type"

interface Props {
	imageGenerated: ImageGeneratedProps | null
	changeImageGenerated: (imageGenerated: ImageGeneratedProps) => void
}

const UnSplashOption = ({ imageGenerated, changeImageGenerated }: Props) => {
	const route = useRoute<AddGoalItemModalRouteProps>()
	const navigation = useNavigation<AddGoalItemModalNavigationProps>()
	const unSplashImage = useUnSplashImageStore(state => state.image)
	const updateUnSplashImage = useUnSplashImageStore(state => state.updateUnSplashImage)
	const [loading, setLoading] = useState(false)

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
		// Check if there's any new data passed from the UnSplashModal screen Otherwise do nothing
		if (!unSplashImage) return

		changeImageGenerated({
			url: unSplashImage?.urls?.full,
			generationMethod: "unsplash",
		})

		updateUnSplashImage(null)
	}, [changeImageGenerated, unSplashImage, updateUnSplashImage])

	return (
		<View className="flex-grow justify-between items-center space-y-2">
			<GenerationOptionImage
				loading={loading}
				source={imageGenerated?.url || ""}
				onLoadStart={() => setLoading(true)}
				onLoad={() => setLoading(false)}
			/>

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
