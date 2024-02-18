import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Text from '../common/Text';
import customColors from '../../../colors';
import colors from 'tailwindcss/colors';

interface IntervalOptionProps {
    label: string;
    value: string;
    icon: string;
    active?: boolean;
    handlePress: (interval: { label: string; value: string; icon: string }) => void;
}

const IntervalOption: React.FC<IntervalOptionProps> = ({ label, value, icon, active, handlePress }) => {
    return (
        <TouchableOpacity className='flex-row items-center justify-start space-x-3 mb-3' onPress={() => handlePress({ label, value, icon })}>
            <FontAwesome6 name={icon} size={19} color={active ? customColors.secondary : colors.gray[400]} />
            <Text className={`text-base font-semibold ${active ? 'text-secondary' : 'text-gray-400'} `}>{label}</Text>
        </TouchableOpacity>
    );
};

export default IntervalOption