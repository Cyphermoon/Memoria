import { TouchableHighlight, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import Text from "../common/Text"
import colors from "tailwindcss/colors"

type IconNames = "delete-outline" | "delete" | "edit" | 'favorite'

interface Props {
    onPress: (id: string) => void
    text: string
    danger?: boolean
    id: string
    icon: IconNames | ((color: string, size: number) => JSX.Element)
}

const GoalActionItem = ({ onPress, text, danger, id, icon }: Props) => {
    return (
        <TouchableOpacity onPress={() => onPress(id)}>
            <View className="flex-row items-center mb-4">
                {typeof icon === "string" ?
                    <MaterialIcons
                        name={icon as IconNames}
                        color={danger ? colors.red[400] : colors.gray[400]}
                        size={20}
                    /> :
                    icon(danger ? colors.red[400] : colors.gray[400], 20)
                }
                <Text className={`${danger ? 'text-red-400' : 'text-gray-400'} text-base ml-1`}>{text}</Text>
            </View>

        </TouchableOpacity>
    )
}

export default GoalActionItem