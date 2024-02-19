import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { imageGenerationModes } from '../../../../settings'
import { RootStackParamList } from '../../../../type'
import HeaderCancelButton from '../../../components/AddGoalItem/HeaderCancelButton'
import AIImageOption from '../../../components/Goal/AIImageOption'
import DescriptionInput from '../../../components/Goal/DescriptionInput'
import GalleryOption from '../../../components/Goal/GalleryOption'
import ImageGenerationSelector from '../../../components/Goal/ImageGenerationSelector'
import UnSplashOption from '../../../components/Goal/UnSplashOption'
import { ImageGeneratedProps, ImageGenerationMethodOptionProps } from '../../../components/Goal/type'
import Touchable from '../../../components/common/Touchable'
import { NavigationProp, RouteProp } from '@react-navigation/native'


type Props = NativeStackScreenProps<RootStackParamList, 'NewGoalItem'>
export type AddGoalItemModalRouteProps = RouteProp<RootStackParamList, 'NewGoalItem'>
export type AddGoalItemModalNavigationProps = NavigationProp<RootStackParamList, 'NewGoalItem'>



const AddGoalItemModal = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()

    const [description, setDescription] = useState('')
    const [descriptionFocused, setDescriptionFocused] = useState(false)

    const [selectedMode, setSelectedMode] =
        useState<ImageGenerationMethodOptionProps | null>(imageGenerationModes[0])
    const [imageGenerated, setImageGenerated] = useState<ImageGeneratedProps | null>(null)

    function handleImageSelected(mode: ImageGenerationMethodOptionProps) {
        setSelectedMode(mode)
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
                    paddingBottom: insets.bottom,
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

                <Touchable isText>Create</Touchable>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default AddGoalItemModal
