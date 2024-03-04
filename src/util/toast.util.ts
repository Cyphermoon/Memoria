import Toast from "react-native-root-toast"
import colors from 'tailwindcss/colors'

export const successToast = (message: string) => {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        backgroundColor: colors.green[500],
        containerStyle: { elevation: 10 },
    })
}

export const errorToast = (message: string, position: "top" | "bottom" = "bottom") => {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        backgroundColor: colors.red[500],
        containerStyle: { elevation: 10 },
        position:position === "top" ? Toast.positions.TOP : Toast.positions.BOTTOM
    })
}