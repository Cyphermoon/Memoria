export type ImageGenerationMethodOptionProps = {
	label: string
	value: string
	icon: "wand-magic-sparkles" | "unsplash" | "photo-film"
}

export interface ImageGeneratedProps {
	url: string
	generationMethod: string
}

export interface IntervalOptionProps {
	label: string
	value: string
	icon: string
}

// export type GoalItemEditorProps = {
//     id: string,
//     url: string,
//     name: string,
// }

interface Keyword {
	score: number
	word: string
}

export interface SentimentAnalysisSchema {
	author: string
	email: string
	keywords: Keyword[]
	ratio: number
	result_code: string
	result_msg: string
	score: number
	type: string
	version: string
}
