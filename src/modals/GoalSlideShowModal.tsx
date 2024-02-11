import { FontAwesome5 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { RootStackParamList } from '../../App'
import { GoalItemProps } from '../components/Goal/type'
import Text from '../components/common/Text'

// Types
type Props = NativeStackScreenProps<RootStackParamList, "GoalSlideShow">

interface SlideProps extends GoalItemProps {
}

// Constants
const GUTTER = 32
const IMAGE_WIDTH = Dimensions.get('window').width - GUTTER

const GoalSlideShowModal = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets()
    const [currentIdx, setCurrentIdx] = useState(0)

    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}
            className='bg-primary flex-grow flex-col items-center px-4'>
            <TouchableOpacity className='self-end mt-3 mb-12' onPress={() => navigation.goBack()} >
                <FontAwesome5 name="times" size={24} color={colors.gray[200]} />
            </TouchableOpacity>

            <Text className='font-semibold mb-6 text-base'>
                {currentIdx + 1} of {route.params.goals.length}
            </Text>

            <Carousel
                width={IMAGE_WIDTH + GUTTER}
                scrollAnimationDuration={1000}
                onSnapToItem={setCurrentIdx}
                data={route.params.goals}
                renderItem={({ item }) => <Slide imageUrl={item.imageUrl} description={item.description} id={item.id} />} />

        </View>
    )
}

export default GoalSlideShowModal

// Child component
const Slide = ({ description, imageUrl, id }: SlideProps) => {
    return (
        <View className='flex-grow items-center'>
            <Image
                style={styles.imageSlide}
                source={imageUrl}
                contentFit='cover'
                className='rounded-xl mb-10' />

            <Text className='text-base text-center mb-10'>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    imageSlide: {
        width: IMAGE_WIDTH,
        aspectRatio: 2 / 3
    },
})