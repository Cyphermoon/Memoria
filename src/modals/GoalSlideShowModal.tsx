import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Image } from 'expo-image'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../App'
import Text from '../components/common/Text'

// Types
type Props = NativeStackScreenProps<RootStackParamList, "GoalSlideShow">

interface SlideProps {
    text: string
    imageUrl: string
}

// Constants
const GUTTER = 32
const IMAGE_WIDTH = Dimensions.get('window').width - GUTTER

const GoalSlideShowModal = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()

    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}
            className='bg-primary flex-grow flex-col items-center px-4'>
            <TouchableOpacity className='self-end mt-3 mb-16' onPress={() => navigation.goBack()} >
                <FontAwesome5 name="times" size={24} color="white" />
            </TouchableOpacity>

            <Slide imageUrl='https://picsum.photos/seed/picsum/500/500' text='Want to become the best' />

        </View>
    )
}

export default GoalSlideShowModal


const Slide = ({ text, imageUrl }: SlideProps) => {
    return (
        <View>
            <Image
                style={styles.imageSlide}
                source={imageUrl}
                contentFit='cover'
                className='rounded-xl mb-10' />

            <Text className='text-base text-center mb-10'>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    imageSlide: {
        width: IMAGE_WIDTH,
        aspectRatio: 2 / 3
    }
})