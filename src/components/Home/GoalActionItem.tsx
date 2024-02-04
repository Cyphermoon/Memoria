import { TouchableHighlight, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import Text from "../common/Text"
import colors from "tailwindcss/colors"

interface Props {
    onPress: (id: string) => void
    text: string
    danger?: boolean
    id: string
    icon: "delete-outline" | "delete" | "edit"
}

const GoalActionItem = ({ onPress, text, danger, id, icon }: Props) => {
    return (
        <TouchableOpacity onPress={() => onPress(id)}>
            <View className="flex-row items-center space-x-1 mb-4">
                <MaterialIcons name={icon} size={20} color={danger ? colors.red[400] : colors.gray[400]} />
                <Text className={`${danger ? 'text-red-400' : 'text-gray-400'} text-base`}>{text}</Text>
            </View>

        </TouchableOpacity>
    )
}

export default GoalActionItem