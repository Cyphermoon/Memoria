import { TouchableOpacity } from "react-native";
import Text from "./Text";

interface Props {
    id: string
    title: string;
    current_id: string
    onPress: (id: string) => void;
}

const SortItem = ({ title, onPress, id, current_id }: Props) => {
    const active = id === current_id;
    return (
        <TouchableOpacity className={`text-base font-semibold mb-2 `} onPress={() => onPress(id)}>
            <Text className={`text-base font-semibold ${active ? 'text-secondary' : 'text-gray-400'}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default SortItem