import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import customColors from '../../colors'
import ImageGenerationSelector from '../components/Goal/ImageGenerationSelector'
import { ImageGenerationMethodOptionProps } from '../components/Goal/type'
import Text from '../components/common/Text'
import Touchable from '../components/common/Touchable'
import DescriptionInput from '../components/Goal/DescriptionInput'

export const imageGenerationModes: ImageGenerationMethodOptionProps[] = [
    { label: 'AI Generated', value: 'ai', icon: 'wand-magic-sparkles' },
    { label: 'Gallery', value: 'gallery', icon: 'photo-film' },
    { label: 'Unsplash', value: 'unsplash', icon: 'unsplash' },
]

const AddGoalItemModal = () => {
    const insets = useSafeAreaInsets()

    const [description, setDescription] = useState('')
    const [selectedMode, setSelectedMode] = useState<ImageGenerationMethodOptionProps | null>(imageGenerationModes[0])

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
            <Text className='text-2xl text-secondary text-center font-semibold mt-4 mb-10'>Add Goal</Text>

            <View className='space-y-10 mb-6 flex-grow'>
                <ImageGenerationSelector
                    handleImageSelected={handleImageSelected}
                    selectedMode={selectedMode} />

                <DescriptionInput description={description} setDescription={setDescription} />

                <View className='flex-grow justify-center items-center border-2 border-gray-700 rounded-lg p-4'>
                    {selectedMode?.value === 'ai' && <View className='space-y-4'>
                        <ActivityIndicator
                            size="large"
                            color={customColors.secondary} />
                        <Text>Generating Image...</Text>
                    </View>}
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