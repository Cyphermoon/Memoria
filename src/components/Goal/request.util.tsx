import { SentimentAnalysisSchema } from "./type"
import { UnsplashResponse } from "./unsplash.type"

interface UnSplashOtherOptionsProps {
	query?: string
	page?: number
	per_page?: number
	order_by?: "latest" | "relevant"
	collections?: string
	content_filter?: "low" | "high"
	color?:
		| "black_and_white"
		| "black"
		| "white"
		| "yellow"
		| "orange"
		| "red"
		| "purple"
		| "magenta"
		| "green"
		| "teal"
		| "blue"
	orientation?: "landscape" | "portrait" | "squarish"
}

export async function getUnsplashPhotos(_url: string, options: UnSplashOtherOptionsProps): Promise<UnsplashResponse> {
	const BASE_URL = "https://api.unsplash.com"
	let url = `${BASE_URL}${_url}?`

	// Add options to url
	if (options) {
		for (const key in options) {
			if (!Object.prototype.hasOwnProperty.call(options, key)) continue
			url += `${key}=${options[key as keyof UnSplashOtherOptionsProps]}&`
		}
	}
	// fetch data
	const res = await fetch(url, {
		headers: {
			Authorization: `Client-ID ${process.env.EXPO_PUBLIC_ACCESS_KEY}`,
		},
	})

	const data = await res.json()

	return data
}

export async function getSentimentAnalysis(text: string): Promise<SentimentAnalysisSchema | null> {
	const rapidKey = process.env.EXPO_PUBLIC_RAPID_API_KEY

	if (!rapidKey) return null
	if (!text.trim()) return null

	const encodedText = encodeURIComponent(text)
	const url = `https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=${encodedText}`

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"x-rapidapi-key": rapidKey,
				"x-rapidapi-host": "twinword-sentiment-analysis.p.rapidapi.com",
				"Content-Type": "application/json",
			},
		})
		const sentimentAnalysis = response.json()
		return sentimentAnalysis
	} catch (err) {
		console.error(err)
		throw new Error(String(err))
	}
}
