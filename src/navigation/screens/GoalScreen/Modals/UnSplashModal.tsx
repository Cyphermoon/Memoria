import { getUnsplashPhotos } from '@components/Goal/request.util';
import SearchBar from '@components/common/SearchBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blurHash } from 'settings';
import { useDebounce } from 'src/util/debounce.hook';
import { HomeStackParamList } from 'type';

type Props = NativeStackScreenProps<HomeStackParamList, "UnSplashModal">

const UnSplashModal = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 1500)
    const [images, setImages] = useState<UnsplashResult[]>([]);

    //* Search Actions
    const handleSearchQueryChanged = (query: string) => {
        setSearchQuery(query);
    }


    function handleSearchSubmit() {
        setSearchQuery(searchQuery)
    }

    function handleImagePressed(unsplashImage: UnsplashResult) {
        navigation.navigate("NewGoalItem", { unsplashImage, editFolderItem: route.params.editFolderItem, folder: route.params.folder })
    }

    useEffect(() => {
        const url = searchQuery ?
            { uri: '/search/photos', option: { query: searchQuery, per_page: 20 } } :
            { uri: '/photos', option: { per_page: 20 } }

        getUnsplashPhotos(url.uri, url.option)
            .then(data => {
                setImages(data.results || data)
            })
            .catch(err => console.log(err))

        // This makes the request run after the searchQuery has been debounced for some time
    }, [debouncedSearchQuery])

    return (
        <View
            className='bg-primary flex-grow px-4 pt-10 space-y-10'
            style={{
                paddingBottom: insets.bottom,
            }}>
            <SearchBar
                variant='filled'
                searchQuery={searchQuery}
                setSearchQuery={handleSearchQueryChanged}
                handleSearchSubmit={handleSearchSubmit} />

            <View className='flex-grow h-96'>

                <FlatList
                    data={images}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImagePressed(item)} className='p-1 w-[50%] h-[150]'>
                            <Image
                                source={item.urls.full}
                                className='h-full w-full'
                                placeholder={blurHash}
                                contentFit='cover'
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