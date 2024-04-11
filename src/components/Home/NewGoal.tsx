import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import colors from '../../../colors';


interface Props {
    onPress: () => void
}

const NewGoal = ({ onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='bg-accent w-16 h-16 rounded-full justify-center items-center shadow-sm shadow-secondary absolute right-4 bottom-24 z-20'>
            <FontAwesome6 name="add" size={30} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
    )
}

export default NewGoal