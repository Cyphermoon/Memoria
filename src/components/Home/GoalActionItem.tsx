import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import Text from "../common/Text";
import { FolderProps } from "./type";

type IconNames = "delete-outline" | "delete" | "edit" | 'favorite'

interface Props {
    onPress: () => void
    label: string
    danger?: boolean
    icon: IconNames | ((color: string, size: number) => JSX.Element)
    // selectedFolder: FolderProps | string
}

const GoalActionItem = ({ onPress, label, danger, icon }: Props) => {
    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View className="flex-row items-center mb-5">
                {typeof icon === "string" ?
                    <MaterialIcons
                        name={icon as IconNames}
                        color={danger ? colors.red[400] : colors.gray[400]}
                        size={20}
                    /> :
                    icon(danger ? colors.red[400] : colors.gray[400], 20)
                }
                <Text className={`${danger ? 'text-red-400' : 'text-gray-400'} text-lg ml-4`}>{label}</Text>
            </View>

        </TouchableOpacity>
    )
}

export default GoalActionItem