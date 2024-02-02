import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import React, { useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, useWindowDimensions, } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { RootStackParamList } from '../../App'
import { blurHash } from '../../settings'
import Text from '../components/common/Text'
import { interpolate } from 'react-native-reanimated'

// Onboarding slides
const _slides = [
    {
        title: 'Always Remember What You Need To Do!',
        description: 'Memoria allows you to easily remember any plans and/or goals you have set for the day.',
        uri: require('../../assets/images/onboard-1.png'),
        alt: 'Onboarding 1'
    },
    {
        title: 'Memoria wakes you up with a purpose',
        description: 'Memoria allows you to easily remember any plans and/or goals you have set for the day.',
        uri: require('../../assets/images/onboard-2.png'),
        alt: 'Onboarding 2'
    },
    {
        title: 'Search for perfect images to match plans with!',
        description: 'Memoria allows you to easily remember any plans and/or goals you have set for the day.',
        uri: require('../../assets/images/onboard-3.png'),
        alt: 'Onboarding 3'
    },
]


interface RenderSlidesProps {
    item: typeof _slides[0]
    index: number

}

type Props = NativeStackScreenProps<RootStackParamList, "onBoarding">

const OnBoardingScreen = ({ navigation }: Props) => {
    const ref = useRef<ICarouselInstance>(null)
    const [currentIdx, setCurrentIdx] = useState(0)
    const windowWidth = useWindowDimensions().width;

    function moveToNextSlide() {
        if (!ref.current) return

        ref.current.scrollTo({ count: 1, animated: true })
    }

    function moveToAuthScreen() {
        navigation.navigate('Auth')
    }

    const animationStyle = React.useCallback(
        (value: number) => {
            "worklet";

            const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
            const scale = interpolate(value, [-1, 0, 1], [1, 1, 0.65]);
            const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

            return {
                transform: [{ scale }],
                zIndex,
                opacity,
            };
        },
        [],
    );


    return (
        <SafeAreaView className="flex-grow bg-primary flex flex-col justify-between">
            <TouchableOpacity className='self-end mr-4' onPress={moveToAuthScreen}>
                <Text>Skip</Text>
            </TouchableOpacity>

            <Carousel
                vertical={false}
                width={windowWidth}
                height={500}
                ref={ref}
                style={styles.carousel}
                autoPlay={true}
                autoPlayInterval={3000}
                data={_slides}
                customAnimation={animationStyle}
                onSnapToItem={index => setCurrentIdx(index)}
                renderItem={({ item, index }: { item: typeof _slides[0], index: number }) => (
                    <Slide item={item} index={index} />
                )} />

            {/* Scroll Indicators */}
            <View className='flex flex-row justify-center'>
                <ScrollIndicator isActive={currentIdx === 0} />
                <ScrollIndicator isActive={currentIdx === 1} />
                <ScrollIndicator isActive={currentIdx === 2} />
            </View>



            <TouchableOpacity className='self-end mr-4 bg-secondary px-5 py-2.5 rounded-lg' onPress={moveToNextSlide}>
                <Text className='text-primary'>Next</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default OnBoardingScreen


const Slide = ({ item, index }: RenderSlidesProps) => {
    return (
        <View key={`slide-${index}`} className='space-y-10 flex flex-col'>
            <Image
                source={item.uri}
                alt={item.title}
                placeholder={blurHash}
                contentFit={"contain"}
                className='w-80 h-80 self-center'
                transition={1000}
            />

            <View className='space-y-2.5'>
                <Text className='text-center font-bold text-2xl leading-tight'> {item.title}</Text>
                <Text className='text-center text-gray-300'>
                    {item.description}
                </Text>
            </View>
        </View>
    )
}

const ScrollIndicator = ({ isActive }: { isActive: boolean }) => {
    const activeStyle = isActive ? 'bg-white' : 'bg-gray-400';
    return <View className={`w-2.5 h-2.5 rounded-full ${activeStyle} mx-1`} />;
}


const styles = StyleSheet.create({
    carousel: {
        width: "100%",
        alignSelf: "center",
    }
})