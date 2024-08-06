import React from "react"
import { TextInput, TouchableWithoutFeedback, View, useWindowDimensions } from "react-native"
import colors from "tailwindcss/colors"
import Text from "../common/Text"

interface Props {
	description: string
	setDescription: (description: string) => void
	focused: boolean
	setFocused: (focused: boolean) => void
}

const DescriptionInput = ({ description, setDescription, focused, setFocused }: Props) => {
	const { width } = useWindowDimensions()

	return (
		<TouchableWithoutFeedback onPress={() => focused && setFocused(false)}>
			<View className="space-y-3 mb-6">
				<Text className="font-medium">Description</Text>

				<TextInput
					placeholder="Enter your goal, task or inspiration here "
					placeholderTextColor={colors.gray[400]}
					value={description}
					onChangeText={setDescription}
					style={{ width: width - 32 }}
					className="bg-primary-300 rounded-lg p-3 h-auto text-gray-300"
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
				/>
			</View>
		</TouchableWithoutFeedback>
	)
}

export default DescriptionInput
