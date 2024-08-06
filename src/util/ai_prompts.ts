import { model } from "firebaseConfig"

export async function getGeminiResponse(prompt: string) {
	try {
		const result = await model.generateContent(`${prompt}`)
		const response = result.response
		const text = response.text()

		return text
	} catch (error) {
		throw new Error(`An error occurred while generating your image: ${error}`)
	}
}

export async function getAIImageDescription(prompt: string) {
	const instructions =
		"Extract a image-generation prompt form the provided description. The prompt should communicate a modern style art. "

	const description = await getGeminiResponse(`${instructions} "${prompt}"`)

	return description
}

export async function getAIClarifiedTextDescription(prompt: string) {
	if (!prompt) return null

	const instructions = `Re-write the following sentence to be clear, short and concise. I would like three possible options in a javascript array data structure.

	The response to this prompt should only be a javascript array to facilitate easier consumption programmatically.
	`
	const description = await getGeminiResponse(`${instructions} "${prompt}"`)

	return description
}
