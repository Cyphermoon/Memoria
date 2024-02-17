import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import customColors from '../../colors'
import DescriptionInput from '../components/Goal/DescriptionInput'
import ImageGenerationSelector from '../components/Goal/ImageGenerationSelector'
import { ImageGeneratedProps, ImageGenerationMethodOptionProps } from '../components/Goal/type'
import Text from '../components/common/Text'
import Touchable from '../components/common/Touchable'
import { imageGenerationModes } from '../../settings'
import AIImageOption from '../components/Goal/AIImageOption'
import GalleryOption from '../components/Goal/GalleryOption'
import UnSplashOption from '../components/Goal/UnSplashOption'


const AddGoalItemModal = () => {
    const insets = useSafeAreaInsets()

    const [description, setDescription] = useState('')
    const [selectedMode, setSelectedMode] = useState<ImageGenerationMethodOptionProps | null>(imageGenerationModes[0])
    const [imageGenerated, setImageGenerated] = useState<ImageGeneratedProps | null>(null)

    function handleImageSelected(mode: ImageGenerationMethodOptionProps) {
        setSelectedMode(mode)
    }

    return (
        <View
            className='px-4 flex-grow bg-primary'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>
            <Text className='text-2xl text-secondary text-center font-semibold my-4'>Add Goal</Text>

            <View className='space-y-10 mb-6 flex-grow'>
                <ImageGenerationSelector
                    handleImageSelected={handleImageSelected}
                    selectedMode={selectedMode} />

                <DescriptionInput description={description} setDescription={setDescription} />

                <View className='border-2 border-gray-700 rounded-lg p-4 flex-grow'>
                    {selectedMode?.value === 'ai' && (
                        <AIImageOption
                            description={description}
                            ImageGenerated={imageGenerated}
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
    )
}

export default AddGoalItemModal


const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: '100%',
        color: 'white',
        // backgroundColor: 'red',
        borderRadius: 10
    }
})