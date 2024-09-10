import { Entypo, MaterialIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { CloudinaryResponse, EditFolderItemProps } from "src/util/HomeDrawer/type"
import colors from "../../../colors"
import { truncateText } from "../../util"
import Text from "../common/Text"

//Todo: Re develop this screen to have a dynamic header like the one on home screen
//Todo: Make the background of the page reflect the dominant color of the current folder item image

// Define the properties for the GoalItem component
interface Props {
	image: CloudinaryResponse
	active: boolean | undefined
	name: string
	id: string
	generationMode: string
	aiTitle: string
	handleSetFolderItem: () => void
	onDelete: (itemId: string, imageId: string) => void
	onFullscreen: (id: string) => void
	onEdit: (item: EditFolderItemProps) => void
}

// Define the GoalItem component
const GoalItem = ({
	image,
	name,
	id,
	active,
	generationMode,
	aiTitle,
	onDelete,
	onFullscreen,
	onEdit,
	handleSetFolderItem,
}: Props) => {
	return (
		// The main container for the GoalItem
		<Animated.View style={[active && styles.elevate]} className="relative w-full h-48 rounded-2xl">
			<TouchableWithoutFeedback onPress={handleSetFolderItem}>
				<Image source={image.secure_url} className="w-full h-full rounded-2xl" contentFit="cover" />
			</TouchableWithoutFeedback>

			<BlurView
				intensity={30}
				tint="dark"
				style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				className="rounded-b-2xl w-full flex-row items-center justify-between  py-3 px-2 absolute bottom-0 left-0"
			>
				<Text className="text-lg">{truncateText(name, 25)}</Text>

				<View className="flex-row space-x-3">
					<TouchableOpacity
						onPress={() =>
							onEdit({
								id,
								description: name,
								image,
								generationMode,
								aiTitle,
							})
						}
					>
						<Entypo name="edit" size={26} color={colors.secondary} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => onFullscreen(id)}>
						<MaterialIcons name="fullscreen" size={26} color={colors.secondary} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => onDelete(id, image.public_id)}>
						<MaterialIcons name="delete" size={26} color={colors.secondary} />
					</TouchableOpacity>
				</View>
			</BlurView>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	elevate: {
		elevation: 8,
		borderStyle: "solid",
		borderWidth: 4,
		borderColor: colors.secondary,
	},
})

// Export the GoalItem component
export default GoalItem
