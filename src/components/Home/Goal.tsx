import { Entypo } from '@expo/vector-icons';
import customColors from 'colors';
import React, { useEffect } from 'react';
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
import colors from 'tailwindcss/colors';
import { plural } from '../../util';
import Text from '../common/Text';
import { FolderProps } from './type';

interface Props {
  className?: string
  onPress: (goal: FolderProps) => void
  onMoreDetailsPress?: (goal: FolderProps) => void
  onLongPress?: (goal: FolderProps) => void
  selectedFolder: FolderProps
  active: boolean
  fullWidth?: boolean
}

const Goal = ({ className = "", onPress, selectedFolder, onMoreDetailsPress, active, fullWidth, onLongPress }: Props) => {

  // console.log("active:", active, "Name:", selectedFolder.name, "Items:", selectedFolder.items)

  return (
    <View
      className={`h-36 ${fullWidth ? 'w-full' : 'w-[185]'} relative items-center justify-center rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}
    >
      {onMoreDetailsPress &&
        <TouchableOpacity
          className='absolute top-2 right-2'
          onPress={() => onMoreDetailsPress && onMoreDetailsPress(selectedFolder)}>
          <Entypo name="dots-three-horizontal" size={20} color={active ? customColors.accent : colors.gray[500]} />
        </TouchableOpacity>}

      <TouchableOpacity
        onPress={() => onPress(selectedFolder)}
        onLongPress={() => {
          if (onLongPress) {
            onLongPress(selectedFolder)
            return
          }

          if (onMoreDetailsPress) {
            onMoreDetailsPress(selectedFolder)
            return
          }
        }}>
        <Text className={`${active ? 'text-accent' : 'text-secondary'} font-bold text-2xl`} >
          {selectedFolder.name}
        </Text>
      </TouchableOpacity>

      <Text className={`absolute bottom-1.5 left-2 text-sm ${active ? 'text-accent' : 'text-gray-500'}`}>
        {selectedFolder.items} {plural(selectedFolder.items, "item")}
      </Text>
    </View>
  )
}

export default Goal