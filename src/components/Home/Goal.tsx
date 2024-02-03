import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Text from '../common/Text'
import { plural } from '../../util'

interface Props {
  className?: string
  onPress: () => void
  text: string
  active: boolean
  items: number
}

const Goal = ({ className = "", onPress, text, active, items }: Props) => {
  return (
    <View className={`w-[185] h-36 relative rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}>
      <TouchableOpacity className='flex-grow justify-center items-center' onPress={onPress}>
        <Text className={`absolute top-1.5 right-2 text-sm ${active ? 'text-accent' : 'text-gray-400'}`}>
          {items} {plural(items, "item")}
        </Text>

        <Text className={`${active ? 'text-accent' : 'text-secondary'} font-bold text-2xl`} >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Goal