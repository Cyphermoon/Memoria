import React from 'react'
import { TouchableOpacity } from 'react-native'
import Text from '../common/Text'
import { FontAwesome6 } from '@expo/vector-icons';
import { ImageGenerationMethodOptionProps } from './type';
import customColors from '../../../colors';
import colors from 'tailwindcss/colors';

interface Props {
    label: string,
    handlePress: (mode: ImageGenerationMethodOptionProps) => void
    value: string
    active?: boolean
    icon: "wand-magic-sparkles" | "unsplash" | "photo-film"
}

const SelectImageGenerationMethodOption = ({ label, value, active, icon, handlePress }: Props) => {
    return (
        <TouchableOpacity className='flex-row items-center justify-start space-x-3 mb-3' onPress={() => handlePress({ label, value, icon })}>
            <FontAwesome6 name={icon} size={19} color={active ? customColors.secondary : colors.gray[400]} />
            <Text className={`text-base font-semibold ${active ? 'text-secondary' : 'text-gray-400'} `}>{label}</Text>
        </TouchableOpacity>
    )
}

export default SelectImageGenerationMethodOption