import NewGoal from "@components/Home/NewGoal"
import { AntDesign } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
	CollectionReference,
	DocumentReference,
	collection,
	doc,
	onSnapshot,
} from "firebase/firestore"
import { firestoreDB } from "firebaseConfig"
import React, { useEffect, useRef, useState } from "react"
import { Alert, FlatList, Platform, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { intervalOptions } from "settings"
import { truncateText } from "src/util"
import { deleteFolderItem, deleteImageFromCloudinary } from "src/util/HomeDrawer/addGoalItem.util"
import { useActiveFolder } from "src/util/HomeDrawer/index.hook"
import { editCommunityFolder, editFolder } from "src/util/HomeDrawer/index.utll"
import { EditFolderItemProps, FolderItemProps } from "src/util/HomeDrawer/type"
import {
	updateFolderAndActiveFolder,
	updateUserActiveFolderItemIdx,
} from "src/util/changeWallpaperBackgroundTask/firestore.util"
import { NonHeadlessAndroidWallpaperUpdateChange } from "src/util/changeWallpaperBackgroundTask/index.util"
import { errorToast, neutralToast } from "src/util/toast.util"
import { useAuthStore } from "store/authStore"
import customColors from "../../../../colors"
import { HomeStackParamList } from "../../../../type"
import GoalItem from "../../../components/Goal/GoalItem"
import IntervalSelector from "../../../components/Goal/IntervalSelector"
import { IntervalOptionProps } from "../../../components/Goal/type"
import SearchBar from "../../../components/common/SearchBar"
import Text from "../../../components/common/Text"
import { useSlidePosition } from "../../../context/SlidePositionProvider"

type Props = NativeStackScreenProps<HomeStackParamList, "Goal">

const GoalScreen = ({ route, navigation }: Props) => {
	const ref = useRef<FlatList<any> | null>(null)
	const { position } = useSlidePosition()
	const userId = useAuthStore(state => state.user?.uid)
	const inset = useSafeAreaInsets()
	const isAndroid = Platform.OS === "android"

	const [selectedInterval, setSelectedInterval] = useState<IntervalOptionProps>(intervalOptions[0])
	const [searchQuery, setSearchQuery] = useState("")
	const [folderItems, setFolderItems] = useState<FolderItemProps[]>([])
	const [filteredFolderItems, setFilteredFolderItems] = useState<FolderItemProps[]>([])

	const activeFolder = useActiveFolder(userId)
	const activeFolderItemIdx = activeFolder?.activeFolderItemIdx && activeFolder.activeFolderItemIdx

	const handleIntervalSelected = (interval: IntervalOptionProps) => {
		// update the interval in the database
		route.params.folder.mode === "personal" &&
			userId &&
			editFolder(userId, route.params.folder.id, { interval: interval.value }, null)
		route.params.folder.mode === "community" &&
			userId &&
			editCommunityFolder(route.params.folder.id, { interval: interval.value })
	}

	function movetoNewGoalItem() {
		navigation.navigate("NewGoalItem", {
			folder: {
				id: route.params.folder.id,
				type: route.params.folder.mode,
			},
		})
	}

	async function handlePreviousWallpaper() {
		if (!userId) return

		if (route.params.folder.mode === "personal") {
			// deduct the activeFolderItemIdx by 1 in personal collection then use the new Idx to get folderItem and update the user wallpaper
			await updateFolderAndActiveFolder(-1, route.params.folder.id)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"personal"
				))
		} else if (route.params.folder.mode === "community") {
			// deduct the activeFolderItemIdx by 1 in the community collection then use the new Idx to get folderItem and update the user wallpaper
			await updateUserActiveFolderItemIdx(userId, -1)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"community"
				))
		}
	}

	async function handleNextWallpaper() {
		if (!userId) return

		if (route.params.folder.mode === "personal") {
			// add the activeFolderItemIdx by 1 in personal collection then use the new Idx to get folderItem and update the user wallpaper
			await updateFolderAndActiveFolder(1, route.params.folder.id)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"personal"
				))
		} else if (route.params.folder.mode === "community") {
			// add the activeFolderItemIdx by 1 in the community collection then use the new Idx to get folderItem and update the user wallpaper
			await updateUserActiveFolderItemIdx(userId, 1)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"community"
				))
		}
	}

	async function syncWallpaper() {
		if (!userId) return

		if (Platform.OS === "android") {
			// use the current activeFolderItemIdx to update the user wallpaper without and side effect like updating the activeFolderItemIdx
			route.params.folder.mode === "personal" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"personal"
				))

			route.params.folder.mode === "community" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"community"
				))
		} else if (Platform.OS === "ios") {
			neutralToast("This functionality is only available on Android")
		}
	}

	async function handleSetWallpaper(idx: number) {
		if (!userId) return

		if (route.params.folder.mode === "personal") {
			// deduct the activeFolderItemIdx by 1 in personal collection then use the new Idx to get folderItem and update the user wallpaper
			await updateFolderAndActiveFolder(0, route.params.folder.id, idx)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"personal"
				))
		} else if (route.params.folder.mode === "community") {
			// deduct the activeFolderItemIdx by 1 in the community collection then use the new Idx to get folderItem and update the user wallpaper
			await updateUserActiveFolderItemIdx(userId, 0, idx)
			Platform.OS === "android" &&
				(await NonHeadlessAndroidWallpaperUpdateChange(
					route.params.isActive,
					route.params.folder.id,
					false,
					"community"
				))
		}
	}

	//* Search Actions

	function handleSearchSubmit() {
		//pass
	}

	// Goal Items Actions
	function handleDelete(itemId: string, imageId: string) {
		const message = "Are you sure you want to delete this item"

		Alert.alert(
			"Delete Goal Item", // Alert title
			message, // Alert message
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							if (userId) {
								await deleteImageFromCloudinary(imageId)
								await deleteFolderItem(
									userId,
									route.params.folder.id,
									itemId,
									route.params.folder.mode
								)
							} else {
								errorToast("User not found")
							}
						} catch (error) {
							throw new Error(`${error}`)
						}

						// Add your delete logic here
					},
				},
			],
			{ cancelable: false }
		)
	}

	function handleFullscreen(id: string) {
		navigation.navigate("GoalSlideShow", { currentId: id, goals: folderItems })
	}

	function handleEdit(goalItem: EditFolderItemProps) {
		navigation.navigate("NewGoalItem", {
			folder: {
				id: route.params.folder.id,
				type: route.params.folder.mode,
			},
			editFolderItem: goalItem,
		})
	}

	// FlatList Methods
	const getItemLayout = (
		data: ArrayLike<any> | null | undefined,
		index: number
	): {
		length: number
		offset: number
		index: number
	} => {
		const GOAL_ITEM_HEIGHT = 192

		return { length: GOAL_ITEM_HEIGHT, offset: GOAL_ITEM_HEIGHT * index, index }
	}

	const onScrollToIndexFailed = (info: {
		index: number
		highestMeasuredFrameIndex: number
		averageItemLength: number
	}) => {
		const wait = new Promise(resolve => setTimeout(resolve, 500))
		wait.then(() => {
			ref.current?.scrollToIndex({ index: info.index, animated: true })
		})

		console.error("Could not scroll to index", info.index)
	}

	useEffect(() => {
		if (!userId) return
		let folderRef: DocumentReference | null = null

		// update the folder reference based on the folder mode
		if (route.params.folder.mode === "personal") {
			folderRef = doc(firestoreDB, "users", userId, "folders", route.params.folder.id)
		} else if (route.params.folder.mode === "community") {
			folderRef = doc(firestoreDB, "community", route.params.folder.id)
		}

		// exit the the code if for some reason the folderRef is null
		if (!folderRef) return

		//use a snapshot to listen to changes in the folder collection
		const unsubscribe = onSnapshot(folderRef, doc => {
			const interval = doc.data()?.interval

			// set the selected interval based on the interval in the database
			if (interval) {
				// find the interval option that matches the interval in the database
				const optionInterval = intervalOptions.find(option => option.value === interval)
				optionInterval && setSelectedInterval(optionInterval)
			} else {
				// update the interval in the database if it is not set
				route.params.folder.mode === "personal" &&
					userId &&
					editFolder(userId, route.params.folder.id, { interval: selectedInterval.value }, null)
				route.params.folder.mode === "community" &&
					userId &&
					editCommunityFolder(route.params.folder.id, { interval: selectedInterval.value })
			}
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		// Convert the search query to lower case for case-insensitive search
		const lowerCaseSearchQuery = searchQuery.toLowerCase()

		// Filter the folder items based on the search query
		const filteredItems = folderItems.filter(
			item =>
				// Check if the description includes the search query
				(item.description && item.description.toLowerCase().includes(lowerCaseSearchQuery)) ||
				// Check if the aiTitle includes the search query
				(item.aiTitle && item.aiTitle.toLowerCase().includes(lowerCaseSearchQuery)) ||
				// Check if the aiActionWord includes the search query
				(item.aiActionWord && item.aiActionWord.toLowerCase().includes(lowerCaseSearchQuery))
		)

		// Update the state with the filtered items
		setFilteredFolderItems(filteredItems)
	}, [folderItems, searchQuery])

	useEffect(() => {
		/* populate the folder items */
		if (!userId) return

		// initialize the folderItem reference
		let folderItemRef: CollectionReference | null = null

		// update the folderItem reference based on the folder mode
		if (route.params.folder.mode === "personal") {
			folderItemRef = collection(
				firestoreDB,
				"users",
				userId,
				"folders",
				route.params.folder.id,
				"items"
			)
		} else if (route.params.folder.mode === "community") {
			folderItemRef = collection(firestoreDB, "community", route.params.folder.id, "items")
		}

		// exit the the code if for some reason the folderItemRef is null
		if (!folderItemRef) return

		//use a snapshot to listen to changes in the folderItem collection
		const unsubscribe = onSnapshot(folderItemRef, querySnapshot => {
			const items: FolderItemProps[] = []

			querySnapshot.forEach(doc => {
				// update the temporary items array with the data from the document
				items.push({ id: doc.id, ...doc.data() } as FolderItemProps)
			})

			// set the folderItems state with the items array
			setFolderItems(items)

			// update the items property of a folder to reflect the number of items in the folder
			route.params.folder.mode === "personal" &&
				userId &&
				editFolder(userId, route.params.folder.id, { items: items.length }, null)
			route.params.folder.mode === "community" &&
				userId &&
				editCommunityFolder(route.params.folder.id, { items: items.length })
		})

		return () => unsubscribe()
	}, [userId])

	// useEffect hook to automatically scroll to the current position in a list when 'position' state changes
	useEffect(() => {
		if (ref.current) {
			ref.current.scrollToIndex({ index: position, animated: true })
		}
	}, [position])

	// side effect to update the header right component to an interval selector. It is the replacement of the initial placeholder for the HomeStackNavigator
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IntervalSelector
					selectedInterval={selectedInterval}
					handleIntervalSelected={handleIntervalSelected}
				/>
			),
		})
	}, [selectedInterval])

	return (
		<View
			style={{
				paddingBottom: inset.bottom,
			}}
			className="bg-primary flex-grow px-2.5"
		>
			{/* Header Section */}
			<View className="flex-row justify-between items-center mb-8 mt-6">
				<Text className="text-4xl font-semibold">
					{truncateText(route.params?.folder.name, isAndroid ? 7 : 10)}
				</Text>

				{route.params.isActive && (
					<View className="flex flex-row items-center space-x-6">
						<TouchableOpacity onPress={handlePreviousWallpaper}>
							<AntDesign name="stepbackward" size={24} color={customColors.secondary} />
						</TouchableOpacity>

						<TouchableOpacity onPress={syncWallpaper}>
							<AntDesign name="sync" size={24} color={customColors.secondary} />
						</TouchableOpacity>

						<TouchableOpacity onPress={handleNextWallpaper}>
							<AntDesign name="stepforward" size={24} color={customColors.secondary} />
						</TouchableOpacity>
					</View>
				)}
			</View>

			{/* Search Bar */}
			<View className="mb-10">
				<SearchBar
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					handleSearchSubmit={handleSearchSubmit}
				/>
			</View>

			<NewGoal onPress={movetoNewGoalItem} />

			{/* Goals List */}
			<View className="flex-grow h-96">
				{folderItems.length > 0 ? (
					<FlatList
						ref={ref}
						data={filteredFolderItems}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={<View className="h-10" />}
						renderItem={({ item, index }) => (
							<View className="relative w-full h-56 rounded-2xl">
								<GoalItem
									id={item.id}
									name={item.description}
									image={item.image}
									generationMode={item.generationMode}
									aiTitle={item.aiTitle}
									handleSetFolderItem={() => handleSetWallpaper(index)}
									active={route.params.isActive && index === activeFolderItemIdx}
									onDelete={handleDelete}
									onFullscreen={handleFullscreen}
									onEdit={handleEdit}
								/>
							</View>
						)}
						getItemLayout={getItemLayout}
						onScrollToIndexFailed={onScrollToIndexFailed}
					/>
				) : (
					<Text className="text-center text-lg">There are no items here</Text>
				)}
			</View>
		</View>
	)
}

export default GoalScreen
