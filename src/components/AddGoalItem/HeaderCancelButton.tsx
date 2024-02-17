import { View, Text, TouchableOpacity } from 'react-native'
import { TouchableOpacityProps } from 'react-native-gesture-handler'

interface Props extends TouchableOpacityProps {

}


const HeaderCancelButton = ({ onPress, ...rest }: Props) => {
    return (
        <View>
            <TouchableOpacity
                onPress={onPress}
                {...rest}
            >
                <Text className='text-red-500 text-base font-medium'>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HeaderCancelButton