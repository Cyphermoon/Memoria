import Touchable from "@components/common/Touchable"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { getAIImageDescription } from "src/util/ai_prompts"
import customColors from "../../../colors"
import Text from "../common/Text"
import GenerationOptionImage from "./GenerationOptionImage"
import { ImageGeneratedProps } from "./type"
import { errorToast } from "src/util/toast.util"
import { IMAGE_GENERATION_BOX_HEIGHT } from "settings"
import colors from "tailwindcss/colors"

interface Props {
	description: string
	changeImageGenerated: (imageGenerated: ImageGeneratedProps) => void
	imageGenerated: ImageGeneratedProps | null
	isEditingMode?: boolean
	originalDescription?: string
	debouncedDescription: string
	debounceValueReady: boolean
	isNegativeSentiment: boolean | null
	sentimentLoading: boolean
}

interface UserMessageProps {
	message: string
	type: "error" | "success" | "neutral"
}

async function generateAIImage(modelId: string, description: string, controller: AbortController) {
	try {
		const signal = controller.signal

		const BASE_URL = "https://api-inference.huggingface.co/models"
		const url = `${BASE_URL}/${modelId}`

		const requestData = JSON.stringify({ inputs: description })

		const res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.EXPO_PUBLIC_HUGGING_FACE_API_KEY}`,
			},
			body: requestData,
			signal,
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
	changeImageGenerated,
	imageGenerated,
	isEditingMode,
	originalDescription,
	debouncedDescription,
	debounceValueReady,
	isNegativeSentiment,
	sentimentLoading,
}: Props) => {
	const [loading, setLoading] = useState(!isEditingMode)
	const imageGenerationController = useMemo(() => new AbortController(), [])
	const [userMessage, setUserMessage] = useState<UserMessageProps | null>(null)

	// This function Coordinate operations between getting more descriptive image prompt and using it to generate an image
	const handleImageRequest = useCallback(
		async (imageDescription: string) => {
			if (sentimentLoading) return
			// This variable is null when the current user description sentiment analysis has changed and a new sentiment analysis is about to be generated
			if (isNegativeSentiment === null) return

			// Show an error message if the current description sentiment is negative
			if (isNegativeSentiment) {
				errorToast("Inappropriate description is not acceptable for AI generation")
				changeImageGenerated({
					url: "",
					generationMethod: "",
				})
				return
			}

			try {
				setLoading(true)
				const aiImageDescription = await getAIImageDescription(imageDescription)

				// Call the generateAIImage function with the model and description
				const imageURL = await generateAIImage(
					"stabilityai/stable-diffusion-xl-base-1.0",
					aiImageDescription,
					imageGenerationController
				)

				changeImageGenerated({
					url: imageURL,
					generationMethod: "ai",
				})
			} catch (error) {
				console.error("An error occurred while generating an image for you: ", error)
			} finally {
				setLoading(false)
			}
		},
		[changeImageGenerated, imageGenerationController, isNegativeSentiment, sentimentLoading]
	)

	useEffect(() => {
		/* This useEffect uses a single dependency because the following code is to be executed only when the debounced description changes. No other dependencies are considered */

		let shouldRequestImage = true

		// Do nothing if description has not changed and image url is not empty.
		const _originalDescription = originalDescription?.trim().toLowerCase()
		const _dynamicDescription = debouncedDescription.trim().toLowerCase()

		if (!debounceValueReady) return

		if (
			_dynamicDescription === _originalDescription &&
			imageGenerated?.url !== "" &&
			imageGenerated?.generationMethod === "ai"
		) {
			shouldRequestImage = false
		}

		if (_dynamicDescription === "") {
			changeImageGenerated({
				url: "",
				generationMethod: "",
			})
			shouldRequestImage = false
			imageGenerationController.abort("Description is empty, so cancel any attempt to create an image")
		}

		if (shouldRequestImage) {
			handleImageRequest(description)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedDescription, debounceValueReady, handleImageRequest])

	// Set appropriate user message to communicate current operations to user
	useEffect(() => {
		if (!description && !imageGenerated?.url) {
			setUserMessage({
				message: "Enter a goal, inspiration or anything you to visualize and we generate an image for you",
				type: "neutral",
			})
		} else if (!sentimentLoading && isNegativeSentiment !== null && isNegativeSentiment) {
			setUserMessage({
				message: "AI cannot generate inappropriate image",
				type: "error",
			})
		} else {
			setUserMessage(null)
		}
	}, [description, imageGenerated?.url, isNegativeSentiment, sentimentLoading])

	return (
		<View
			className={`space-y-2 flex-grow justify-between items-center border-2 ${userMessage?.type !== "error" ? "border-gray-700" : "border-red-500"} rounded-lg p-2 w-full h-[${IMAGE_GENERATION_BOX_HEIGHT}]`}
		>
			{userMessage && (
				<Text style={[userMessage?.type === "error" && styles.textError]} className="text-center">
					{userMessage.message}
				</Text>
			)}

			{description && loading && (
				<View className="flex-grow justify-center">
					<ActivityIndicator size="large" color={customColors.secondary} />
				</View>
			)}

			{!loading && imageGenerated?.url && <GenerationOptionImage source={imageGenerated.url} showFeedBack={false} />}

			{userMessage?.type !== "error" && (
				<Touchable
					onPress={() => handleImageRequest(description)}
					disabled={description === "" || loading}
					className="w-full bg-primary-300 flex-row justify-center items-center"
				>
					<Text className="text-gray-400">Generate Another</Text>
				</Touchable>
			)}
		</View>
	)
}

export default AIImageOption

const styles = StyleSheet.create({
	textError: {
		color: colors.red["500"],
	},
})
