import Counter from '@components/common/Counter';
import UserAvatar from '@components/common/UserAvatar';
import { Entypo, Fontisto } from '@expo/vector-icons';
import customColors from 'colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { plural } from '../../util';
import Text from '../common/Text';
import { CommunityFolderProps } from './type';

interface Props {
    className?: string
    onPress: (folder: CommunityFolderProps) => void
    onMoreDetailsPress: (folder: CommunityFolderProps) => void
    handleLike: (id: string) => void
    folder: CommunityFolderProps
    liked: boolean
    active: boolean
}

const CommunityGoal = ({
    className = "",
    folder,
    active,
    liked,
    onPress,
    onMoreDetailsPress,
    handleLike
}: Props) => {


    return (
        <View className={`rounded-2xl space-y-2`}>
            <View
                className={`w-full py-1 px-2 flex-col h-36 relative items-center justify-between rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}
            >
                <TouchableOpacity
                    className='self-end'
                    onPress={() => onMoreDetailsPress(folder)}>
                    <Entypo name="dots-three-horizontal" size={20} color={active ? customColors.accent : colors.gray[500]} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onPress(folder)}
                    onLongPress={() => onMoreDetailsPress(folder)}>
                    <Text className={`${active ? 'text-accent' : 'text-secondary'} font-bold text-2xl`} >
                        {folder.name}
                    </Text>
                </TouchableOpacity>

                <View className='flex-row items-center justify-between w-full'>
                    <Text className={`text-sm ${active ? 'text-accent' : 'text-gray-500'}`}>
                        {folder.items} {plural(folder.items, "item")}
                    </Text>
                </View>
            </View>

            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center space-x-2'>
                    <UserAvatar username={folder.user.name} />
                    <Text className='text-sm text-gray-500'>{folder.user.name}</Text>
                </View>

                <View className='space-x-10 flex-row items-center'>
                    <TouchableOpacity className='flex-row' onPress={() => handleLike(folder.id)}>
                        <Entypo name="heart" size={20} color={liked ? customColors.accent : colors.gray[500]} />
                        <Counter count={folder.likes} liked={liked} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row'>
                        <Fontisto name="radio-btn-active" size={20} color={colors.gray[500]} />
                        <Counter count={folder.likes} liked={false} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default CommunityGoal