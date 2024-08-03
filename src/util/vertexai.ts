import { model } from "firebaseConfig"

export async function getGeminiResponse(prompt: string) {
	try {
		const instructions =
			"Extract a image-generation prompt form the provided description. The prompt should communicate a modern style art. "
		const result = await model.generateContent(`${instructions}: ${prompt}`)
		const response = result.response
		const text = response.text()

		return text
	} catch (error) {
		throw new Error(`An error occurred while generating your image: ${error}`)
	}
}
