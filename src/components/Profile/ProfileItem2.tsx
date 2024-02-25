import Touchable from '@components/common/Touchable';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native';
import colors from 'tailwindcss/colors';

interface Props {
    onPress: () => void
    text: string
    showIcon?: boolean
    textCenter?: boolean
}

const ProfileItem = ({ onPress, text, textCenter, showIcon = true }: Props) => {
    return (
        <Touchable className={`bg-primary-300 flex-row items-center ${textCenter ? 'justify-center' : 'justify-between'}  mb-3`} onPress={onPress}>
            <Text className={`text-gray-400`}>{text}</Text>
            {showIcon &&
                <Entypo name="chevron-small-right" size={20} color={colors.gray[400]} />
            }
        </Touchable>
    )
}

export default ProfileItem