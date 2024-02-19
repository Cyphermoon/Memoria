import { useNavigation, useRoute } from '@react-navigation/native'
import { AddGoalItemModalNavigationProps, AddGoalItemModalRouteProps } from '@screens/GoalScreen/Modals/AddGoalItemModal'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { ImageGeneratedProps } from './type'


interface Props {
    imageGenerated: ImageGeneratedProps | null
    setImageGenerated: (imageGenerated: ImageGeneratedProps) => void
}

const UnSplashOption = ({ imageGenerated, setImageGenerated }: Props) => {
    const route = useRoute<AddGoalItemModalRouteProps>()
    const navigation = useNavigation<AddGoalItemModalNavigationProps>()

    const openUnSplashModal = () => {
        navigation.navigate('UnSplashModal')
    }

    useEffect(() => {
        // If an image is already selected and the generation method is 'unsplash', do nothing
        if (imageGenerated?.url && imageGenerated?.generationMethod === 'unsplash') return

        openUnSplashModal()
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Check if there's any new data passed from the UnSplashModal screen
            if (route.params?.unsplash?.uri) {
                // Do something with the selected image
                console.log(route.params.unsplash.uri);
            }
        });

        return unsubscribe;
    }, [navigation, route.params]);
    return (
        <View>
            <Text>UnSplashOption</Text>
        </View>
    )
}

export default UnSplashOption