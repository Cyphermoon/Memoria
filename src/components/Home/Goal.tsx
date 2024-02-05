import { View, TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import React from 'react'
import Text from '../common/Text'
import { plural } from '../../util'
import colors from 'tailwindcss/colors';
import { SelectedGoalProps } from './type';

interface Props {
  id: string
  className?: string
  onPress: (goal: SelectedGoalProps) => void
  onMoreDetailsPress: (goal: SelectedGoalProps) => void
  text: string
  active: boolean
  items: number
}

const Goal = ({ className = "", onPress, text, active, items, id, onMoreDetailsPress }: Props) => {
  const goal = { id, name: text }
  return (
    <View className={`w-[185] h-36 relative items-center justify-center rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}>
      <TouchableOpacity className='absolute top-2 right-2' onPress={() => onMoreDetailsPress(goal)}>
        <Entypo name="dots-three-horizontal" size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress(goal)} onLongPress={() => onMoreDetailsPress(goal)}>
        <Text className={`${active ? 'text-accent' : 'text-secondary'} font-bold text-2xl`} >
          {text}
        </Text>
      </TouchableOpacity>

      <Text className={`absolute bottom-1.5 left-2 text-sm ${active ? 'text-accent' : 'text-gray-500'}`}>
        {items} {plural(items, "item")}
      </Text>
    </View>
  )
}

export default Goal