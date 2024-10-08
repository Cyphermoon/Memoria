import * as ImagePicker from "expo-image-picker"
import React, { useCallback, useEffect, useState } from "react"
import { View } from "react-native"
import Text from "../common/Text"
import Touchable from "../common/Touchable"
import GenerationOptionImage from "./GenerationOptionImage"
import { ImageGeneratedProps } from "./type"

// Define the props for the GalleryOption component
interface Props {
	changeImageGenerated: (imageGenerated: ImageGeneratedProps) => void
	imageGenerated: ImageGeneratedProps | null
}

const GalleryOption = ({ changeImageGenerated, imageGenerated }: Props) => {
	const [loading, setLoading] = useState(false)

	const pickImage = useCallback(async () => {
		// Launch the image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
		})

		// If the user didn't cancel the picker, set the image
		if (!result.canceled) {
			changeImageGenerated({
				url: result.assets[0].uri,
				generationMethod: "gallery",
			})
		}
	}, [changeImageGenerated])

	useEffect(() => {
		// If an image is already selected and the generation method is 'gallery', do nothing
		if (imageGenerated?.url && imageGenerated?.generationMethod === "gallery") return

		// Otherwise, pick an image
		pickImage()
	}, [])

	return (
		<View className="flex-grow justify-between items-center space-y-5">
			{/* If an image is selected, display it */}
			<GenerationOptionImage
				loading={loading}
				source={imageGenerated?.url || ""}
				onLoadStart={() => setLoading(true)}
				onLoad={() => setLoading(false)}
			/>

			{/* Button to pick another image */}
			<Touchable
				onPress={pickImage}
				variant="muted"
				className="w-full bg-primary-300 flex-row justify-center items-center"
			>
				<Text className="text-gray-400">Choose Another</Text>
			</Touchable>
		</View>
	)
}

export default GalleryOption
