import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import colors from 'tailwindcss/colors';

interface Props {
    title: string;
    goBack: () => void;
}

export const BackButton = ({ title, goBack }: Props) => {
    return (
        <TouchableOpacity className='flex-row pb-1 space-x-.5 items-start justify-start ' onPress={goBack}>
            <Ionicons name="chevron-back" size={16} color={colors.gray[300]} />
            <Text className='text-secondary'>{title}</Text>
        </TouchableOpacity>
    );
};