import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';
import Text from './Text';

interface Props {
    title: string;
    goBack: () => void;
}

export const BackButton = ({ title, goBack }: Props) => {
    return (
        <TouchableOpacity className='flex-row pb-1 space-x-.5 items-center justify-start ' onPress={goBack}>
            <Ionicons name="chevron-back" size={20} color={colors.gray[300]} />
            <Text className='text-secondary text-base'>{title}</Text>
        </TouchableOpacity>
    );
};