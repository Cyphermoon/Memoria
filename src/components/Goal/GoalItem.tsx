import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { truncateText } from '../../util';
import Text from '../common/Text';
import colors from '../../../colors';
import { Entypo } from '@expo/vector-icons';
import { GoalItemProps } from './type';

// Define the properties for the GoalItem component
interface Props {
    url: string,
    name: string,
    id: string,
    onDelete: (id: string) => void,
    onFullscreen: (id: string) => void
    onEdit: (item: GoalItemProps) => void
}

// Define the GoalItem component
const GoalItem = ({ url, name, id, onDelete, onFullscreen, onEdit }: Props) => {

    return (
        // The main container for the GoalItem
        <Animated.View className='relative w-full h-48 rounded-2xl'>
            <Image source={url} className="w-full h-full rounded-2xl" contentFit='cover' />


            <View
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className='rounded-b-2xl w-full flex-row items-center justify-between  py-3 px-2 absolute bottom-0 left-0'>


                <Text className='text-lg'>{truncateText(name, 25)}</Text>


                <View className='flex-row space-x-3'>
                    <TouchableOpacity onPress={() => onEdit({ id, description: name, imageUrl: url })}>
                        <Entypo name="edit" size={26} color={colors.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onFullscreen(id)}>
                        <MaterialIcons name="fullscreen" size={26} color={colors.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onDelete(id)}>
                        <MaterialIcons name="delete" size={26} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

// Export the GoalItem component
export default GoalItem;

