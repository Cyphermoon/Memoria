import { FontAwesome5 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import React, { useEffect, useRef } from 'react'
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import colors from '../../../../../colors'
import { HomeStackParamList } from '../../../../../type'

import { useSlidePosition } from '../../../../context/SlidePositionProvider'
import { parallaxLayout } from '../../../../util/parallax'
import Text from '@components/common/Text'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { CloudinaryResponse, FolderItemProps } from 'src/util/HomeDrawer/type'


// Types
type Props = NativeStackScreenProps<HomeStackParamList, "GoalSlideShow">

interface SlideProps {
    animationValue: SharedValue<number>
    id: string
    description: string
    image: CloudinaryResponse
}

// Constants
const GUTTER = 32
const IMAGE_WIDTH = Dimensions.get('window').width - GUTTER

const GoalSlideShowModal = ({ navigation, route }: Props) => {
    const { position, setPosition } = useSlidePosition()

    const ref = useRef<ICarouselInstance>(null)
    const insets = useSafeAreaInsets()
    const isAndroid = Platform.OS === 'android'

    useEffect(() => {
        // Set the current item to the Id provided
        if (route.params.currentId) {
            const initialIdx = route.params.goals.findIndex(goal => goal.id === route.params.currentId)
            setPosition(initialIdx)
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
            <TouchableOpacity className={`self-end ${isAndroid ? 'my-1.5' : 'mt-3 mb-4'} `} onPress={() => navigation.goBack()} >
                <FontAwesome5 name="times" size={32} color={colors.secondary} />
            </TouchableOpacity>

            <Text className='font-semibold mb-5 text-base'>
                {position + 1} of {route.params.goals.length}
            </Text>

            <Carousel
                ref={ref}
                width={IMAGE_WIDTH + GUTTER}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => setPosition(index)}
                data={route.params.goals}
                renderItem={({ item, animationValue }) => {
                    return (
                        <Slide
                            image={item.image}
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
const Slide = ({ description, image, id, animationValue }: SlideProps) => {
    const bottomTabBarHeight = useBottomTabBarHeight()

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
        <Animated.View className='flex-grow items-center' style={[opacityStyle]}>
            <Image
                style={styles.imageSlide}
                source={image.secure_url}
                contentFit='cover'
                className='rounded-xl mb-6' />

            <Text
                className={`text-base text-center`}>
                {description}
            </Text>
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