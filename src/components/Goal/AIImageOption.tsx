import Touchable from "@components/common/Touchable"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { blurHash } from "settings"
import { getAIImageDescription } from "src/util/ai_prompts"
import customColors from "../../../colors"
import Text from "../common/Text"
import { ImageGeneratedProps } from "./type"

interface Props {
	description: string
	setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
	imageGenerated: ImageGeneratedProps | null
	isEditingMode?: boolean
	originalDescription?: string
	debouncedDescription: string
}

async function generateAIImage(modelId: string, description: string) {
	try {
		const BASE_URL = "https://api-inference.huggingface.co/models"
		const url = `${BASE_URL}/${modelId}`

		const requestData = JSON.stringify({ inputs: description })

		const res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.EXPO_PUBLIC_HUGGING_FACE_API_KEY}`,
			},
			body: requestData,
		})

		// Get the image in binary format
		const blob = await res.blob()

		// Convert blob to base64 using a promise to wait for FileReader to complete
		const base64Data = new Promise<string>((resolve, reject) => {
			const reader = new FileReader()

			// resolve to base64 when reading is complete. Otherwise send an error to the consumer
			reader.onloadend = () => resolve(reader.result as string)
			reader.onerror = reject

			// Start reading as base64
			reader.readAsDataURL(blob)
		})

		return base64Data
	} catch (error) {
		throw new Error(String(error))
	}
}

const AIImageOption = ({
	description,
	setImageGenerated,
	imageGenerated,
	isEditingMode,
	originalDescription,
	debouncedDescription,
}: Props) => {
	const [loading, setLoading] = useState(!isEditingMode)

	// This function Coordinate operations between getting more descriptive image prompt and using it to generate an image
	const handleImageRequest = async (imageDescription: string) => {
		// Set loading state to true
		setLoading(true)

		try {
			const aiImageDescription = await getAIImageDescription(imageDescription)

			// Call the generateAIImage function with the model and description
			const imageURL = await generateAIImage("stabilityai/stable-diffusion-xl-base-1.0", aiImageDescription)

			setImageGenerated({
				url: imageURL,
				generationMethod: "ai",
			})
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		/* This useEffect uses a single dependency because the following code is to be executed only when the debounced description changes. No other dependencies are considered */

		// Do nothing if description has not changed and image url is not empty.
		const _originalDescription = originalDescription?.trim().toLowerCase()
		const _dynamicDescription = debouncedDescription.trim().toLowerCase()
		if (
			_dynamicDescription === _originalDescription &&
			imageGenerated?.url !== "" &&
			imageGenerated?.generationMethod === "ai"
		)
			return

		// If an image is already selected and the generation method is 'AI', do nothing
		if (imageGenerated?.url && imageGenerated?.generationMethod === "ai" && !isEditingMode) return

		if (description === "") {
			setImageGenerated({
				url: "",
				generationMethod: "ai",
			})
			return
		}

		handleImageRequest(description)

		// Clear the image when the component unmounts
		return () => {
			setImageGenerated({
				url: "",
				generationMethod: "",
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedDescription])

	return (
		<View className="space-y-4 flex-grow justify-between items-center">
			{!description && !imageGenerated?.url && (
				<Text className="text-center">
					Enter a goal, inspiration or anything you to visualize and we generate an image for you
				</Text>
			)}

			{description && loading && (
				<View className="flex-grow justify-center">
					<ActivityIndicator size="large" color={customColors.secondary} />
					<Text>Generating Image...</Text>
				</View>
			)}

			{!loading && imageGenerated?.url && (
				<Image
					source={imageGenerated.url}
					className="flex-grow w-full"
					contentFit="cover"
					placeholder={blurHash}
					transition={200}
				/>
			)}
			<Touchable
				onPress={() => handleImageRequest(description)}
				variant="muted"
				className="w-full bg-primary-300 flex-row justify-center items-center"
			>
				<Text className="text-gray-400">Generate Another</Text>
			</Touchable>
		</View>
	)
}

export default AIImageOption
