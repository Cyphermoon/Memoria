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


const AIImageOption = ({ description, setImageGenerated, imageGenerated }: Props) => {
    const [loading, setLoading] = useState(true)
    const debouncedDescription = useDebounce(description, 2000)
    const [triggerReRender, setTriggerReRender] = useState(false)

    useEffect(() => {
        // If an image is already selected and the generation method is 'AI', do nothing
        if (imageGenerated?.url && imageGenerated?.generationMethod === 'ai') return
        if (!description) return


        setLoading(true)
        generateAIImage('stabilityai/stable-diffusion-xl-base-1.0', description)
            .then(data => {
                const reader = new FileReader();

                reader.onloadend = function () {
                    const base64data = reader.result;

                    // set image to base64
                    setImageGenerated({
                        url: base64data as string,
                        generationMethod: 'ai'
                    })
                }
                // read as base64
                reader.readAsDataURL(data);


                setLoading(false);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))

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
                onPress={() => setTriggerReRender(!triggerReRender)}
                variant='muted'
                className='w-full bg-primary-300 flex-row justify-center items-center'>
                <Text className='text-gray-400'>Generate Another</Text>
            </Touchable>
        </View>
    )
}

export default AIImageOption