/* eslint-disable react/no-unstable-nested-components */
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { NavigationProp, RouteProp } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { serverTimestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Keyboard, TouchableWithoutFeedback, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
	deleteImageFromCloudinary,
	editFirestoreFolderItem,
	uploadFolderItem,
	uploadImage,
} from "src/util/HomeDrawer/addGoalItem.util"
import { AddFolderItemProps, EditFolderItemProps, ImageUploadType } from "src/util/HomeDrawer/type"
import { successToast } from "src/util/toast.util"
import { useAuthStore } from "store/authStore"
import { imageGenerationModes } from "../../../../../settings"
import { HomeStackParamList } from "../../../../../type"
import HeaderCancelButton from "../../../../components/AddGoalItem/HeaderCancelButton"
import AIImageOption from "../../../../components/Goal/AIImageOption"
import DescriptionInput from "../../../../components/Goal/DescriptionInput"
import GalleryOption from "../../../../components/Goal/GalleryOption"
import ImageGenerationSelector from "../../../../components/Goal/ImageGenerationSelector"
import UnSplashOption from "../../../../components/Goal/UnSplashOption"
import { ImageGeneratedProps, ImageGenerationMethodOptionProps } from "../../../../components/Goal/type"
import Touchable from "../../../../components/common/Touchable"
import Text from "@components/common/Text"

type Props = NativeStackScreenProps<HomeStackParamList, "NewGoalItem">
export type AddGoalItemModalRouteProps = RouteProp<HomeStackParamList, "NewGoalItem">
export type AddGoalItemModalNavigationProps = NavigationProp<HomeStackParamList, "NewGoalItem">

const uploadTypeMap = {
	unsplash: "url",
	gallery: "file",
	ai: "base64",
}

const AddGoalItemModal = ({ navigation, route }: Props) => {
	const insets = useSafeAreaInsets()
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [descriptionFocused, setDescriptionFocused] = useState(false)

	const [selectedMode, setSelectedMode] = useState<ImageGenerationMethodOptionProps>(imageGenerationModes[0])
	const [description, setDescription] = useState("")
	const [imageGenerated, setImageGenerated] = useState<ImageGeneratedProps | null>(null)

	const userId = useAuthStore(state => state.user?.uid)
	// const activeFolder = useActiveFolder(userId)
	const isEditingMode = route.params.editFolderItem !== undefined

	function handleImageSelected(mode: ImageGenerationMethodOptionProps) {
		setSelectedMode(mode)
	}

	async function handleCreateFolderItem() {
		if (!userId) return
		if (!route.params.folder) return

		// Check if imageGenerated exists and has a uri property
		if (imageGenerated && imageGenerated.url) {
			try {
				// Map the selected mode type to the upload type

				// Get the upload type from the map
				let uploadType =
					selectedMode && (uploadTypeMap[selectedMode.value as keyof typeof uploadTypeMap] as ImageUploadType)

				// If the upload type is not defined, throw an error
				if (!uploadType) {
					throw new Error("Invalid mode type")
				}

				// Upload the image and get the URL
				const image = await uploadImage(imageGenerated.url, uploadType, "Test")

				// Create the folder item with the image URL and description
				const folderItem: AddFolderItemProps = {
					image,
					description,
					generationMode: selectedMode?.value,
					aiTitle: "Test",
					dateCreated: serverTimestamp(),
				}

				//Upload the folder item
				const imageUploadId = await uploadFolderItem(
					userId,
					route.params.folder?.id,
					folderItem,
					route.params.folder?.type
				)

				if (imageUploadId) {
					successToast("Folder Item Created successfully")
					navigation.canGoBack() && navigation.goBack()
				}
			} catch (error) {
				console.error("An Error Occurred: ", error)
			}
		} else {
			console.error("No image selected")
		}
	}

	async function handleEditFolderItem() {
		const itemId = route.params.editFolderItem?.id

		if (!userId || !itemId) return
		if (!route.params.folder) return
		if (!route.params.editFolderItem) return

		const publicId = route.params.editFolderItem?.image.public_id

		// Check if imageGenerated exists and has a uri property
		if (imageGenerated && imageGenerated.url) {
			try {
				// Map the selected mode type to the upload type

				// Get the upload type from the map
				let uploadType =
					selectedMode && (uploadTypeMap[selectedMode.value as keyof typeof uploadTypeMap] as ImageUploadType)

				// If the upload type is not defined, throw an error
				if (!uploadType) {
					throw new Error("Invalid mode type")
				}

				// Delete the image from Cloudinary
				await deleteImageFromCloudinary(publicId)

				// Upload another image to Cloudinary
				const image = await uploadImage(imageGenerated.url, uploadType, "Test")

				// Create the folder item with the image URL and description
				const folderItem: EditFolderItemProps = {
					image,
					description,
					generationMode: selectedMode?.value,
					aiTitle: "Test",
					id: itemId,
				}

				// Edit the folder item
				route.params.editFolderItem &&
					(await editFirestoreFolderItem(userId, route.params.folder.id, itemId, route.params.folder.type, folderItem))

				successToast("Folder Item Edited successfully")
				navigation.canGoBack() && navigation.goBack()
			} catch (error) {
				console.error("An Error Occurred: ", error)
			}
		} else {
			console.error("No image selected")
		}
	}

	useEffect(() => {
		// Configure the screen options on load
		navigation.setOptions({
			headerRight: () => <HeaderCancelButton onPress={() => navigation.goBack()} />,
			headerTitle: () => (
				<Text className="text-xl text-secondary font-medium">{isEditingMode ? "Edit Goal" : "Add Goal"}</Text>
			),
		})
	}, [navigation, isEditingMode])

	useEffect(() => {
		// prefill options based on the editFolderItem
		if (isEditingMode) {
			const { editFolderItem } = route.params

			// Change the header text to indicate editing
			if (editFolderItem) {
				setDescription(editFolderItem.description)

				setSelectedMode(
					imageGenerationModes.find(
						mode => mode.value === editFolderItem.generationMode
					) as ImageGenerationMethodOptionProps
				)

				setImageGenerated({
					generationMethod: editFolderItem.generationMode,
					url: editFolderItem.image.secure_url,
				})
			}
		}
	}, [isEditingMode, route.params])

	return (
		<TouchableWithoutFeedback onPress={() => descriptionFocused && Keyboard.dismiss()}>
			<View
				className="px-4 pt-6 flex-grow bg-primary "
				style={{
					paddingBottom: insets.bottom + bottomTabBarHeight,
				}}
			>
				<View className="space-y-10 mb-6 flex-grow">
					<ImageGenerationSelector handleImageSelected={handleImageSelected} selectedMode={selectedMode} />

					<DescriptionInput
						description={description}
						focused={descriptionFocused}
						setDescription={setDescription}
						setFocused={setDescriptionFocused}
					/>

					<View className="border-2 border-gray-700 rounded-lg p-4 flex-grow">
						{selectedMode?.value === "ai" && (
							<AIImageOption
								description={description}
								originalDescription={route.params.editFolderItem?.description}
								imageGenerated={imageGenerated}
								setImageGenerated={setImageGenerated}
								isEditingMode={isEditingMode}
							/>
						)}

						{selectedMode?.value === "gallery" && (
							<GalleryOption imageGenerated={imageGenerated} setImageGenerated={setImageGenerated} />
						)}

						{selectedMode?.value === "unsplash" && (
							<UnSplashOption imageGenerated={imageGenerated} setImageGenerated={setImageGenerated} />
						)}
					</View>
				</View>

				<Touchable
					disabled={description === ""}
					isText
					onPress={() => {
						isEditingMode ? handleEditFolderItem() : handleCreateFolderItem()
					}}
				>
					{isEditingMode ? "Save" : "Create"}
				</Touchable>
			</View>
		</TouchableWithoutFeedback>
	)
}

export default AddGoalItemModal
