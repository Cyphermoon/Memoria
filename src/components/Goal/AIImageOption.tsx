import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import customColors from '../../../colors'
import Text from '../common/Text'
import { ImageGeneratedProps } from './type'
import { useDebounce } from 'src/util/debounce.hook'
import { Image } from 'expo-image'
import { blurHash } from 'settings'
import Touchable from '@components/common/Touchable'

interface Props {
    description: string
    setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
    imageGenerated: ImageGeneratedProps | null
    isEditingMode?: boolean
    originalDescription?: string
}

async function generateAIImage(modelId: string, description: string) {
    const BASE_URL = 'https://api-inference.huggingface.co/models'
    const url = `${BASE_URL}/${modelId}`

    const requestData = JSON.stringify({ inputs: description })

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_HUGGING_FACE_API_KEY}`,
        },
        body: requestData
    })

    const data = res.blob()
    return data
}


const AIImageOption = ({ description, setImageGenerated, imageGenerated, isEditingMode, originalDescription }: Props) => {
    const [loading, setLoading] = useState(!isEditingMode)
    const debouncedDescription = useDebounce(description, 2000)
    const [triggerReRender, setTriggerReRender] = useState(false)

    // Function to generate an image
    const generateImage = () => {
        // Set loading state to true
        setLoading(true);

        // Call the generateAIImage function with the model and description
        generateAIImage('stabilityai/stable-diffusion-xl-base-1.0', description)
            .then(data => {
                // Create a new FileReader to read the returned data
                const reader = new FileReader();

                // When the reader has finished loading...
                reader.onloadend = function () {
                    // Get the result as base64 data
                    const base64data = reader.result;

                    // Set the generated image state with the base64 URL and the generation method
                    setImageGenerated({
                        url: base64data as string,
                        generationMethod: 'ai'
                    })
                }

                // Start reading the data as a base64 URL
                reader.readAsDataURL(data);

                // Set loading state to false
                setLoading(false);
            })
            .catch(err => {
                // Log any errors
                console.error(err);
            })
            .finally(() => {
                // Ensure loading state is set to false even if an error occurs
                setLoading(false);
            });
    }

    useEffect(() => {
        // If an image is already selected and the generation method is 'AI', do nothing
        if (description.trim().toLowerCase() === originalDescription?.trim().toLowerCase()) return
        if (imageGenerated?.url && imageGenerated?.generationMethod === 'ai' && !isEditingMode) return
        if (!description) return


        setLoading(true)
        // generate the image
        generateImage()

        //Clear the image when the component unmounts
        return () => {
            setImageGenerated({
                url: '',
                generationMethod: '',
            })
        }

    }, [debouncedDescription, triggerReRender])




    return (
        <View className='space-y-4 flex-grow justify-between items-center'>
            {!description && !imageGenerated?.url &&
                <Text className='text-center'>Enter a goal, inspiration or anything you to visualize and we generate an image for you</Text>
            }

            {description && loading &&
                <View className='flex-grow justify-center'>
                    <ActivityIndicator
                        size="large"
                        color={customColors.secondary} />
                    <Text>Generating Image...</Text>

                </View>
            }

            {!loading && imageGenerated?.url &&
                <Image
                    source={imageGenerated.url}
                    className='flex-grow w-full'
                    contentFit='cover'
                    placeholder={blurHash}
                    transition={200}
                />
            }
            <Touchable
                onPress={() => generateImage()}
                variant='muted'
                className='w-full bg-primary-300 flex-row justify-center items-center'>
                <Text className='text-gray-400'>Generate Another</Text>
            </Touchable>
        </View>
    )
}

export default AIImageOption