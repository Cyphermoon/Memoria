import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { imageGenerationModes } from '../../../../../settings'
import { HomeStackParamList } from '../../../../../type'
import HeaderCancelButton from '../../../../components/AddGoalItem/HeaderCancelButton'
import AIImageOption from '../../../../components/Goal/AIImageOption'
import DescriptionInput from '../../../../components/Goal/DescriptionInput'
import GalleryOption from '../../../../components/Goal/GalleryOption'
import ImageGenerationSelector from '../../../../components/Goal/ImageGenerationSelector'
import UnSplashOption from '../../../../components/Goal/UnSplashOption'
import { ImageGeneratedProps, ImageGenerationMethodOptionProps } from '../../../../components/Goal/type'
import Touchable from '../../../../components/common/Touchable'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { uploadFolderItem, uploadImage } from 'src/util/HomeDrawer/addGoalItem.util'
import { useAuthStore } from 'store/authStore'
import { useActiveFolder } from 'src/util/HomeDrawer/index.hook'
import { AddFolderItemProps, ImageUploadType } from 'src/util/HomeDrawer/type'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { successToast } from 'src/util/toast.util'


type Props = NativeStackScreenProps<HomeStackParamList, 'NewGoalItem'>
export type AddGoalItemModalRouteProps = RouteProp<HomeStackParamList, 'NewGoalItem'>
export type AddGoalItemModalNavigationProps = NavigationProp<HomeStackParamList, 'NewGoalItem'>


const AddGoalItemModal = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()
    const bottomTabBarHeight = useBottomTabBarHeight()
    const [descriptionFocused, setDescriptionFocused] = useState(false)

    const [selectedMode, setSelectedMode] = useState<ImageGenerationMethodOptionProps>(imageGenerationModes[0])
    const [description, setDescription] = useState('')
    const [imageGenerated, setImageGenerated] = useState<ImageGeneratedProps | null>(null)

    const userId = useAuthStore(state => state.user?.uid)
    const activeFolder = useActiveFolder(userId)


    function handleImageSelected(mode: ImageGenerationMethodOptionProps) {
        setSelectedMode(mode)
    }

    async function createFolderItem() {
        if (!userId) return
        if (!route.params.folder) return

        // Check if imageGenerated exists and has a uri property
        if (imageGenerated && imageGenerated.url) {
            try {
                // Map the selected mode type to the upload type
                const uploadTypeMap = {
                    'unsplash': 'url',
                    'gallery': 'file',
                    'ai': 'base64'
                };

                // Get the upload type from the map
                let uploadType = selectedMode && uploadTypeMap[selectedMode.value as keyof typeof uploadTypeMap] as ImageUploadType

                // If the upload type is not defined, throw an error
                if (!uploadType) {
                    throw new Error('Invalid mode type');
                }

                // Upload the image and get the URL
                const image = await uploadImage(imageGenerated.url, uploadType, "Test");

                // Create the folder item with the image URL and description
                const folderItem: AddFolderItemProps = {
                    image,
                    description,
                    generationMode: selectedMode?.value,
                    aiTitle: "Test",
                    dateCreated: serverTimestamp()
                };

                //Upload the folder item
                const imageUploadId = await uploadFolderItem(userId, route.params.folder?.id, folderItem, route.params.folder?.type);

                if (imageUploadId) {
                    successToast("Folder Item Created successfully")
                    navigation.canGoBack() && navigation.goBack()
                }

            } catch (error) {
                console.error('An Error Occured: ', error);
            }
        } else {
            console.error('No image selected');
        }
    }

    useEffect(() => {
        // Add functionality to the header right button
        navigation.setOptions({
            headerRight: () => <HeaderCancelButton onPress={() => navigation.goBack()} />
        })

    }, [navigation])

    return (
        <TouchableWithoutFeedback onPress={() => descriptionFocused && Keyboard.dismiss()}>
            <View
                className='px-4 pt-6 flex-grow bg-primary '
                style={{
                    paddingBottom: insets.bottom + bottomTabBarHeight,
                }}>

                <View className='space-y-10 mb-6 flex-grow'>
                    <ImageGenerationSelector
                        handleImageSelected={handleImageSelected}
                        selectedMode={selectedMode} />

                    <DescriptionInput
                        description={description}
                        focused={descriptionFocused}
                        setDescription={setDescription}
                        setFocused={setDescriptionFocused}
                    />

                    <View className='border-2 border-gray-700 rounded-lg p-4 flex-grow'>
                        {selectedMode?.value === 'ai' && (
                            <AIImageOption
                                description={description}
                                imageGenerated={imageGenerated}
                                setImageGenerated={setImageGenerated}
                            />
                        )}

                        {selectedMode?.value === 'gallery' && (
                            <GalleryOption
                                imageGenerated={imageGenerated}
                                setImageGenerated={setImageGenerated} />
                        )}

                        {selectedMode?.value === 'unsplash' && (
                            <UnSplashOption
                                imageGenerated={imageGenerated}
                                setImageGenerated={setImageGenerated}
                            />
                        )}
                    </View>
                </View>

                <Touchable isText onPress={createFolderItem}>Create</Touchable>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default AddGoalItemModal
