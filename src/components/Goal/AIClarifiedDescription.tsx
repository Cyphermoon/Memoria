import Text from "@components/common/Text"
import React from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

interface Props {
	suggestions: string[] | undefined
	suggestionsLoading: boolean
	description: string
	handleSuggestionClicked: (suggestionIdx: number) => void
}

const AIClarifiedDescription = ({ suggestions, suggestionsLoading, handleSuggestionClicked, description }: Props) => {
	return (
		<View className="mb-6 h-[155]">
			<Text className="font-medium mb-2">Suggestions</Text>

			{suggestionsLoading && <Text className="font-light">Loading Suggestion...</Text>}

			{suggestions?.length === 0 && !suggestionsLoading && <Text className="font-light">Suggestions are empty</Text>}

			{suggestions && description && !suggestionsLoading && (
				<View className="flex-row justify-start flex-wrap gap-4">
					{suggestions.map((suggestion, idx) => {
						const key = suggestion.toLowerCase().replace(/\s*/g, "-")

						if (description.toLowerCase() === suggestion.toLowerCase()) return

						return (
							<TouchableOpacity
								key={key}
								className="rounded-lg border border-slate-300 px-3 py-1.5 inline self-start"
								onPress={() => handleSuggestionClicked(idx)}
							>
								<Text className="text-slate-300">{suggestion}</Text>
							</TouchableOpacity>
						)
					})}
				</View>
			)}
		</View>
	)
}

export default AIClarifiedDescription
