import HeaderCancelButton from "@components/AddGoalItem/HeaderCancelButton"
import { getUnsplashPhotos } from "@components/Goal/request.util"
import { UnsplashResult } from "@components/Goal/unsplash.type"
import SearchBar from "@components/common/SearchBar"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { blurHash } from "settings"
import { useDebounce } from "src/util/debounce.hook"
import { useUnSplashImageStore } from "store/unsplashImage"
import { HomeStackParamList } from "type"

type Props = NativeStackScreenProps<HomeStackParamList, "UnSplashModal">

const UnSplashModal = ({ navigation }: Props) => {
	const insets = useSafeAreaInsets()
	const [searchQuery, setSearchQuery] = useState("")
	const debouncedSearchQuery = useDebounce(searchQuery, 1500)
	const [images, setImages] = useState<UnsplashResult[]>([])
	const updateUnSplashImage = useUnSplashImageStore(state => state.updateUnSplashImage)

	//* Search Actions
	const handleSearchQueryChanged = (query: string) => {
		setSearchQuery(query)
	}

	function handleSearchSubmit() {
		setSearchQuery(searchQuery)
	}

	function handleImagePressed(unsplashImage: UnsplashResult) {
		updateUnSplashImage(unsplashImage)
		navigation.goBack()
	}

	useEffect(() => {
		if (typeof debouncedSearchQuery !== "string") return

		const url = debouncedSearchQuery
			? { uri: "/search/photos", option: { query: debouncedSearchQuery, per_page: 20 } }
			: { uri: "/photos", option: { per_page: 20 } }

		getUnsplashPhotos(url.uri, url.option)
			.then(data => {
				setImages(data.results || data)
			})
			.catch(err => console.log(err))

		// This makes the request run after the searchQuery has been debounced for some time
	}, [debouncedSearchQuery])

	return (
		<View
			className="bg-primary flex-grow px-4 pt-3 space-y-10"
			style={{
				paddingBottom: insets.bottom,
			}}
		>
			<HeaderCancelButton useIcon className="self-end mb-4" onPress={() => navigation.goBack()} />
			<SearchBar
				variant="filled"
				searchQuery={searchQuery}
				setSearchQuery={handleSearchQueryChanged}
				handleSearchSubmit={handleSearchSubmit}
			/>

			<View className="flex-grow h-96">
				<FlatList
					data={images}
					keyExtractor={item => item.id}
					numColumns={2}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => handleImagePressed(item)} className="p-1 w-[50%] h-[150]">
							<Image
								source={item.urls.full}
								className="h-full w-full"
								placeholder={blurHash}
								contentFit="cover"
								transition={100}
							/>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	)
}

export default UnSplashModal
