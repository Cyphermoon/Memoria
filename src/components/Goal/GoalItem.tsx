import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../common/Text';
import { truncateText } from '../../util';

// Define the properties for the GoalItem component
interface Props {
    url: string,
    name: string,
    id: string,
    // onDelete is a function that takes a string id as a parameter
    onDelete: (id: string) => void,
    // onFullscreen is a function that takes a string id as a parameter
    onFullscreen: (id: string) => void
}

// Define the GoalItem component
const GoalItem = ({ url, onDelete, onFullscreen, name, id }: Props) => {
    return (
        // The main container for the GoalItem
        <View className='relative w-full h-48 rounded-2xl'>

            <Image source={url} className="w-full h-full rounded-2xl" contentFit='cover' />


            <View
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className='rounded-b-2xl w-full flex-row items-center justify-between  py-3 px-2 absolute bottom-0 left-0'>


                <Text className='text-lg'>{truncateText(name, 25)}</Text>


                <View className='flex-row space-x-3'>

                    <TouchableOpacity onPress={() => onFullscreen(id)}>
                        <MaterialIcons name="fullscreen" size={26} color="white" />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => onDelete(id)}>
                        <MaterialIcons name="delete" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Export the GoalItem component
export default GoalItem;

