import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../common/Text';
import { truncateText } from '../../util';

interface Props {
    url: string
    name: string
    id: string
    onDelete: (id: string) => void
    onFullscreen: (id: string) => void
}

const GoalItem = ({ url, onDelete, onFullscreen, name, id }: Props) => {
    return (
        <View className='relative w-full h-48 rounded-2xl'>
            <Image source={url} className="w-full h-full rounded-2xl" contentFit='cover' />

            <View
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className='rounded-b-2xl w-full flex-row items-center justify-between  py-3 px-2 absolute bottom-0 left-0'>
                <Text className='text-lg'>{truncateText(name, 25)}</Text>

                <View className='flex-row space-x-3'>
                    <TouchableOpacity onPress={() => onFullscreen(id)}>
                        <MaterialIcons name="fullscreen" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onDelete(id)}>
                        <MaterialIcons name="delete" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default GoalItem;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        // Styles for your content
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        // Additional styling for the overlay image
    },
});