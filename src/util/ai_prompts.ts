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
	const instructions = `Re-write the sentence to be as short, clear and concise as possible. 
		Return just the response for the prompt to make it easier to consume the response.`

	const description = await getGeminiResponse(`${instructions} "${prompt}"`)

	return description
}
