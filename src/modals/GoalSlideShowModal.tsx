import { FontAwesome5 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { RootStackParamList } from '../../App'
import { GoalItemProps } from '../components/Goal/type'
import Text from '../components/common/Text'
import { parallaxLayout } from '../components/common/util/parallax'


// Types
type Props = NativeStackScreenProps<RootStackParamList, "GoalSlideShow">

interface SlideProps extends GoalItemProps {
    animationValue: SharedValue<number>
}

// Constants
const GUTTER = 32
const IMAGE_WIDTH = Dimensions.get('window').width - GUTTER


const GoalSlideShowModal = ({ navigation, route }: Props) => {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [currentId, setCurrentId] = useState(route.params.currentId)

    const ref = useRef<ICarouselInstance>(null)
    const insets = useSafeAreaInsets()

    useEffect(() => {
        // Set the current item to the Id provided
        if (route.params.currentId) {
            const initialIdx = route.params.goals.findIndex(goal => goal.id === route.params.currentId)
            setCurrentIdx(initialIdx)
            setCurrentId(route.params.goals[initialIdx].id)
            ref.current?.scrollTo({ index: initialIdx, animated: false })
        }
    }, [])


    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
            className='bg-primary flex-grow flex-col items-center px-4'>
            <TouchableOpacity className='self-end mt-3 mb-12' onPress={() => navigation.goBack()} >
                <FontAwesome5 name="times" size={32} color={colors.gray[200]} />
            </TouchableOpacity>

            <Text className='font-semibold mb-6 text-base'>
                {currentIdx + 1} of {route.params.goals.length}
            </Text>

            <Carousel
                ref={ref}
                width={IMAGE_WIDTH + GUTTER}
                scrollAnimationDuration={1000}
                onSnapToItem={setCurrentIdx}
                data={route.params.goals}
                renderItem={({ item, animationValue }) => {
                    return (
                        <Slide
                            imageUrl={item.imageUrl}
                            description={item.description}
                            id={item.id}
                            animationValue={animationValue} />
                    )
                }}
                customAnimation={parallaxLayout(
                    {
                        size: IMAGE_WIDTH,
                        vertical: false,
                    },
                    {
                        parallaxScrollingScale: 1,
                        parallaxAdjacentItemScale: 0.5,
                        parallaxScrollingOffset: 40,
                    },
                )} />

        </View>
    )
}

export default GoalSlideShowModal


// Child component
const Slide = ({ description, imageUrl, id, animationValue }: SlideProps) => {
    // Opacity Animation
    const opacityStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animationValue.value,
            [-1, 0, 1],
            [0, 1, 0],
        )

        return {
            opacity,
        }
    }, [animationValue])


    return (
        <Animated.View className='flex-grow items-center' style={[opacityStyle]} sharedTransitionTag={id}>
            <Image
                style={styles.imageSlide}
                source={imageUrl}
                contentFit='cover'
                className='rounded-xl mb-10' />

            <Text className='text-base text-center mb-10'>{description}</Text>
        </Animated.View>
    )
}

// Styles
const styles = StyleSheet.create({
    imageSlide: {
        width: IMAGE_WIDTH,
        aspectRatio: 2 / 3
    },
})