import React from "react"
import { Image, ImageProps } from "expo-image"
import { blurHash } from "settings"
import { View } from "react-native"
import Text from "@components/common/Text"

interface Props extends ImageProps {
	source: string
	className?: string
	loading?: boolean
}

const GenerationOptionImage = ({ source, className, loading, ...rest }: Props) => {
	return (
		<View className="w-full flex-grow relative">
			<Image
				source={source}
				className={`w-full flex-grow rounded-sm ${className}`}
				contentFit="cover"
				placeholder={blurHash}
				transition={200}
				{...rest}
			/>

			<View
				className={`flex-grow justify-center items-center rounded-sm shadow-md bg-primary-300 absolute w-full h-full ${loading ? "opacity-100" : "opacity-0"}`}
			>
				<Text className="text-slate-300">Fetching Image...</Text>
			</View>
		</View>
	)
}

export default GenerationOptionImage
