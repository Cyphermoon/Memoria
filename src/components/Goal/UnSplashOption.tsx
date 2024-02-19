import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { AddGoalItemModalNavigationProps, AddGoalItemModalRouteProps } from '@screens/GoalScreen/Modals/AddGoalItemModal'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { ImageGeneratedProps } from './type'
import Touchable from '@components/common/Touchable'
import { Image } from 'expo-image'


interface Props {
    imageGenerated: ImageGeneratedProps | null
    setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
}

const UnSplashOption = ({ imageGenerated, setImageGenerated }: Props) => {
    const route = useRoute<AddGoalItemModalRouteProps>()
    const navigation = useNavigation<AddGoalItemModalNavigationProps>()
    const isFocused = useIsFocused()

    const openUnSplashModal = () => {
        navigation.navigate('UnSplashModal')
    }

    useEffect(() => {
        // If an image is already selected and the generation method is 'unsplash', do nothing
        if (imageGenerated?.url && imageGenerated?.generationMethod === 'unsplash') return

        openUnSplashModal()
    }, [])

    useEffect(() => {
        if (!isFocused) return

        const unsubscribe = navigation.addListener('focus', () => {
            // Check if there's any new data passed from the UnSplashModal screen
            if (!route.params?.unsplashImage) return

            setImageGenerated({
                url: route?.params.unsplashImage?.urls?.full,
                generationMethod: 'unsplash'
            })

        });

        return () => {
            unsubscribe()
            setImageGenerated({
                url: '',
                generationMethod: '',
            })
        };
    }, [navigation, route.params, isFocused]);

    return (
        <View className='flex-grow justify-between items-center space-y-5'>
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
            <Touchable
                onPress={openUnSplashModal}
                variant='muted'
                className='w-full bg-primary-300 flex-row justify-center items-center'>
                <Text className='text-gray-400'>Choose Another</Text>
            </Touchable>
        </View>
    )
}

export default UnSplashOption