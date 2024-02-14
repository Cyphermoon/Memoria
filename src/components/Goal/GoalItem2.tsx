import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { truncateText } from '../../util';
import Text from '../common/Text';

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
        <Animated.View className='relative w-full h-48 rounded-2xl' sharedTransitionTag={id}>

            <Image source={url} className="w-full h-full rounded-2xl" contentFit='cover' />


        </View>
        </Animated.View >
    );
};

// Export the GoalItem component
export default GoalItem;

