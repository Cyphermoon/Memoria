import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

interface Props {
    isChecked: boolean;
    onCheck: () => void;
    children: React.ReactNode;
}

const Checkbox = ({ isChecked, onCheck, children }: Props) => {
    return (
        <View className='flex-row items-center' >
            <Pressable onPress={onCheck}>
                <View className="w-7 h-7 border border-gray-300 rounded-md items-center justify-center" >
                    {isChecked && <Ionicons name="checkmark" size={22} color="white" />}
                </View>
            </Pressable>

            <View className="ml-2">
                {children}
            </View>
        </View>
    );
}

export default Checkbox;