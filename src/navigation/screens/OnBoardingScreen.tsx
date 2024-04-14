import { NavigationProp, useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, useWindowDimensions, } from 'react-native'
import { interpolate } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import Text from '../../components/common/Text'
import { AuthStackParamList, HomeStackParamList } from 'type'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProtectedScreen from './Auth/ProtectedScreen'

// Onboarding slides
const _slides = [
    {
        title: 'Always Remember What You Need To Do!',
        description: 'With Memoria, never forget your daily plans or goals. Keep track of your tasks with ease.',
        uri: require('../../../assets/images/onboard-1.png'),
        alt: 'Onboarding 1: A 3d representation of a pencil tick tasks of a book'
    },
    {
        title: 'Memoria wakes you up with a purpose',
        description: 'Start your day with a clear purpose. Memoria helps you recall your plans and goals as soon as you wake up.',
        uri: require('../../../assets/images/onboard-2.png'),
        alt: 'Onboarding 2: A 3d representation of a man sitting on a chair with his laptop on his lap'
    },
    {
        title: 'Search for perfect images to match plans with!',
        description: 'Visualize your plans with Memoria. Find the perfect images to match your plans and make them more memorable.',
        uri: require('../../../assets/images/onboard-3.png'),
        alt: 'Onboarding 3: A 3d representation of a hand holding a magnifying glass'
    },
];



interface RenderSlidesProps {
    item: typeof _slides[0]
    index: number

}

type Props = NativeStackScreenProps<AuthStackParamList, "onBoarding">

const OnBoardingScreen = ({ navigation }: Props) => {
    const ref = useRef<ICarouselInstance>(null)
    const [currentIdx, setCurrentIdx] = useState(0)
    const windowWidth = useWindowDimensions().width;
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    function moveToNextSlide() {
        if (!ref.current) return

        if (currentIdx === _slides.length - 1) return moveToAuthScreen();

        ref.current.scrollTo({ count: 1, animated: true })
    }

    function moveToAuthScreen() {
        navigation.navigate('Auth')
    }

    function handleSnapToItem(index: number) {
        if (!isFocused) return

        setCurrentIdx(index);
        if (index === _slides.length - 1) {
            setTimeout(() => {
                moveToAuthScreen();
            }, 3000);
        }
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
        <ProtectedScreen>
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }}
                className="flex-grow flex flex-col justify-between bg-primary">

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
                    autoPlayInterval={4000}
                    data={_slides}
                    customAnimation={animationStyle}
                    onSnapToItem={handleSnapToItem}
                    renderItem={({ item, index }: { item: typeof _slides[0], index: number }) => (
                        <Slide item={item} index={index} />
                    )} />

                {/* Scroll Indicators */}
                <View className='flex flex-row justify-center'>
                    <ScrollIndicator isActive={currentIdx === 0} />
                    <ScrollIndicator isActive={currentIdx === 1} />
                    <ScrollIndicator isActive={currentIdx === 2} />
                </View>



                <TouchableOpacity className='bg-secondary p-3 rounded-lg mx-4' onPress={moveToNextSlide}>
                    <Text className='text-primary text-base text-center'>Next</Text>
                </TouchableOpacity>
            </View>
        </ProtectedScreen>
    )
}

export default OnBoardingScreen


const Slide = ({ item, index }: RenderSlidesProps) => {
    return (
        <View key={`slide-${index}`} className='space-y-10 flex flex-col'>
            <Image
                source={item.uri}
                alt={item.title}
                contentFit={"contain"}
                className='w-80 h-80 self-center'
                transition={1000}
            />

            <View className='space-y-2.5'>
                <Text className='text-center font-bold text-2xl leading-tight'> {item.title}</Text>
                <Text className='text-center text-gray-300 mx-0.5'>
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