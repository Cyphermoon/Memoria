import { Entypo } from '@expo/vector-icons';
import customColors from 'colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { plural } from '../../util';
import Text from '../common/Text';
import { CollectionOptionTypes, FolderProps } from './type';

interface Props {
  id: string
  className?: string
  onPress: (goal: FolderProps) => void
  onMoreDetailsPress: (goal: FolderProps) => void
  text: string
  active: boolean
  items: number
  mode: CollectionOptionTypes
}

const Goal = ({ className = "", onPress, text, active, items, id, mode, onMoreDetailsPress }: Props) => {
  const goal = { id, text, items, active, mode }
  return (
    <View
      className={`w-[185] h-36 relative items-center justify-center rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}
    >
      <TouchableOpacity
        className='absolute top-2 right-2'
        onPress={() => onMoreDetailsPress(goal)}>
        <Entypo name="dots-three-horizontal" size={20} color={active ? customColors.accent : colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPress(goal)}
        onLongPress={() => onMoreDetailsPress(goal)}>
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