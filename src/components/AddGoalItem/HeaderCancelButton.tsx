import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { TouchableOpacityProps } from "react-native-gesture-handler"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import colors from "tailwindcss/colors"

interface Props extends TouchableOpacityProps {
	useIcon?: boolean
}

const HeaderCancelButton = ({ onPress, useIcon, ...rest }: Props) => {
	return (
		<View>
			<TouchableOpacity onPress={onPress} {...rest}>
				{useIcon ? (
					<FontAwesome name="times" size={24} color={colors.red["600"]} />
				) : (
					<Text className="text-red-500 text-base font-medium">Cancel</Text>
				)}
			</TouchableOpacity>
		</View>
	)
}

export default HeaderCancelButton
