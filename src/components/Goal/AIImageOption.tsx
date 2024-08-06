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

	const data = res.blob()
	return data
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

	// Function to generate an image
	const generateImage = (imageDescription: string) => {
		// Set loading state to true
		setLoading(true)

		// Call the generateAIImage function with the model and description
		generateAIImage("stabilityai/stable-diffusion-xl-base-1.0", imageDescription)
			.then(data => {
				// Create a new FileReader to read the returned data
				const reader = new FileReader()

				// When the reader has finished loading...
				reader.onloadend = function () {
					// Get the result as base64 data
					const base64data = reader.result

					// Set the generated image state with the base64 URL and the generation method
					setImageGenerated({
						url: base64data as string,
						generationMethod: "ai",
					})
				}

				// Start reading the data as a base64 URL
				reader.readAsDataURL(data)

				// Set loading state to false
				setLoading(false)
			})
			.catch(err => {
				// Log any errors
				console.error(err)
			})
			.finally(() => {
				// Ensure loading state is set to false even if an error occurs
				setLoading(false)
			})
	}

	useEffect(() => {
		/* This useEffect uses a single dependency because the following code is to be executed only when the debounced description changes. No other dependencies are considered */

		// Do nothing if description has not changed
		if (description.trim().toLowerCase() === originalDescription?.trim().toLowerCase()) return

		// If an image is already selected and the generation method is 'AI', do nothing
		if (imageGenerated?.url && imageGenerated?.generationMethod === "ai" && !isEditingMode) return

		if (description === "") {
			setImageGenerated({
				url: "",
				generationMethod: "ai",
			})
			return
		}

		getAIImageDescription(description).then(text => {
			// generate the image
			generateImage(text)
		})

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
				onPress={() => generateImage(description)}
				variant="muted"
				className="w-full bg-primary-300 flex-row justify-center items-center"
			>
				<Text className="text-gray-400">Generate Another</Text>
			</Touchable>
		</View>
	)
}

export default AIImageOption
