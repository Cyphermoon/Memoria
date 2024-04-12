import Text from '@components/common/Text'
import { FontAwesome6 } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { useIsFocused } from '@react-navigation/native'
import colors from 'colors'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import { applyEffectToCloudinaryImage } from 'src/util/HomeDrawer/addGoalItem.util'
import { useActiveFolder } from 'src/util/HomeDrawer/index.hook'
import { ActiveFolderAndItemResponse, getActiveFolderItemImageURL } from 'src/util/changeWallpaperBackgroundTask/firestore.util'
import { errorToast, successToast } from 'src/util/toast.util'
import { useAuthStore } from 'store/authStore'
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Touchable from '@components/common/Touchable';

//TODO: Add interaction functionalities to this screen (edit, delete, like, unlike, etc)


type Props = DrawerScreenProps<HomeDrawerParamList, "ActiveFolderItem">

const ActiveCollectionScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()
    const bottomTabBar = useBottomTabBarHeight()

    const userId = useAuthStore(state => state.user?.uid)
    const _activeFolder = useActiveFolder(userId)
    const isFocused = useIsFocused()
    const [activeFolder, setActiveFolder] = useState<ActiveFolderAndItemResponse | null>(null)

    const downloadImage = async () => {
        // If there is no active folder item, exit the function
        if (!activeFolder?.folderItem) return

        // Request permissions to access the media library
        const { status } = await MediaLibrary.requestPermissionsAsync();

        // If permissions are not granted, show an alert and exit the function
        if (status !== 'granted') {
            Alert.alert('Permissions to access media library are needed to download the image.');
            return;
        }

        // Apply effects to the image URL
        const imageUrl = applyEffectToCloudinaryImage(activeFolder?.folderItem?.image, activeFolder?.folderItem?.description);

        // Download the image from the URL to a local URI
        const { uri: localUri } = await FileSystem.downloadAsync(imageUrl, FileSystem.documentDirectory + `${activeFolder?.folderItem?.description}.jpg`);

        // Create an asset for the downloaded image
        const asset = await MediaLibrary.createAssetAsync(localUri);

        // Save the asset to the 'Download' album
        await MediaLibrary.createAlbumAsync('Download', asset, false);

        // Show a success toast
        successToast("Image downloaded successfully")
    };

    useEffect(() => {
        if (!isFocused) return;
        if (!_activeFolder) return;

        getActiveFolderItemImageURL(userId, _activeFolder)
            .then((res) => {
                if (res === null) return;
                setActiveFolder(res);
            })
            .catch(err => errorToast(err.message))
    }, [userId, _activeFolder])

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: bottomTabBar + insets.bottom
            }}
            className='bg-primary flex-grow px-4'>

            <TouchableOpacity onPress={() => navigation.openDrawer()} className='rotate-180 mr-auto'>
                <FontAwesome6 name="bars-staggered" size={26} color={colors.secondary} />
            </TouchableOpacity>

            {_activeFolder &&
                <View>
                    <Text className='text-center mt-2 text-lg'>This folder item is in a {' '}
                        <Text className='text-accent'>
                            {_activeFolder?.folderCategory}</Text> collection
                    </Text>
                </View>
            }


            {
                activeFolder?.folderItem &&
                <View className='relative w-full h-[87%] mt-5'>
                    <Touchable
                        variant='inverse'
                        onPress={downloadImage}
                        className='absolute top-3 right-2 z-40 text-secondary p-2'
                    >
                        <FontAwesome name="download" size={24} color={colors.secondary} />
                    </Touchable>


                    <Image
                        source={
                            applyEffectToCloudinaryImage(activeFolder?.folderItem?.image, activeFolder?.folderItem?.description)
                        }
                        className='w-full h-full rounded-2xl'
                    />
                </View>


            }

            {/* {_activeFolder ?
                <View className='bg-primary-300 rounded-2xl p-2 border border-accent h-40 flex flex-col justify-between'>
                    <Text className='invisible text-primary-300'>padding</Text>
                    <Text className='text-accent text-center text-medium text-2xl mb-6 justify-self-center'>{_activeFolder?.}</Text>
                    <Text className='text-accent'>{activeFolder?.folderItemsLength} items</Text>
                </View> :
                <Text className='text-center text-3xl font-bold mt-8 mb-8'>No Active Folder</Text>
            } */}

        </View>
    )
}

export default ActiveCollectionScreen