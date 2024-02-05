import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface Props {
    icon: "twitter" | "google" | "linkedin";
    text: string;
    textClass?: string
    disabled?: boolean
    color: string;
    onPress: () => void;
}

const SocialButton = ({ icon, text, disabled, textClass, color, onPress }: Props) => {
    return (
        <TouchableOpacity disabled={disabled} className={`flex-row block items-center justify-center p-3 mb-4 rounded-lg ${color}`} onPress={onPress}>
            {
                icon === "google" ?
                    <Image
                        source={require("../../../assets/images/google.svg")}
                        className='w-[26] h-[26]'
                    /> :
                    <MaterialCommunityIcons name={icon} size={26} color={"white"} />
            }
            <Text className={`text-white font-medium ml-2 ${textClass}`}>{text}</Text>
        </TouchableOpacity>
    );
}

export default SocialButton;