import React, { useCallback, useEffect } from 'react'
import Text from '../common/Text'
import Touchable from '../common/Touchable'
import { View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { ImageGeneratedProps } from './type'

// Define the props for the GalleryOption component
interface Props {
    setImageGenerated: (description: ImageGeneratedProps) => void
    imageGenerated: ImageGeneratedProps | null
}

const GalleryOption = ({ setImageGenerated, imageGenerated }: Props) => {

    const pickImage = useCallback(async () => {
        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        })

        // If the user didn't cancel the picker, set the image
        if (!result.canceled) {
            setImageGenerated({
                url: result.assets[0].uri,
                generationMethod: 'gallery'
            })
        }
    }, [])

    useEffect(() => {
        // If an image is already selected and the generation method is 'gallery', do nothing
        if (imageGenerated?.url && imageGenerated?.generationMethod === 'gallery') return

        // Otherwise, pick an image
        pickImage()

        // When the component unmounts, clear the image
        return () => setImageGenerated({
            url: '',
            generationMethod: '',
        })
    }, [])

    return (
        <View className='flex-grow justify-between items-center space-y-5'>
            {/* If an image is selected, display it */}
            {imageGenerated?.url &&
                <Image
                    source={imageGenerated.url}
                    contentFit="cover"
                    className='w-full flex-grow rounded-lg'
                />
            }

            {!imageGenerated?.url &&
                <Text className='text-gray-400 text-center'>No image selected</Text>
            }

            {/* Button to pick another image */}
            <Touchable
                onPress={pickImage}
                variant='muted'
                className='w-full bg-primary-300 flex-row justify-center items-center'>
                <Text className='text-gray-400'>Choose Another</Text>
            </Touchable>
        </View>
    )
}

export default GalleryOption