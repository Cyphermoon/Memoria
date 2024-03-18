import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stringifier } from 'postcss';

interface Props {
    active: boolean;
    handleActiveChanged: (newState: boolean) => void;
    text: string
    
}

const FilterTag = ({active, handleActiveChanged, text}: Props) => {
  return (
    <View>
         <TouchableOpacity
            onPress={() => handleActiveChanged && handleActiveChanged(!active)}
            className={`py-4 px-8 mr-3 rounded-full justify-center items-center  ${active ? "bg-accent text-primary" : "bg-primary-300 text-gray-400"}`}>
                        <Text className={`${active ? "text-primary" : "text-gray-400"} p-0 text-xs`}>{text}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default FilterTag