import Counter from '@components/common/Counter';
import UserAvatar from '@components/common/UserAvatar';
import { Entypo, Fontisto } from '@expo/vector-icons';
import customColors from 'colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { plural } from '../../util';
import Text from '../common/Text';
import { FirestoreCommunityFolderProps, CustomCommunityFolderProps } from './type';

interface Props {
    className?: string
    onPress: (folder: FirestoreCommunityFolderProps) => void
    onMoreDetailsPress: (folder: CustomCommunityFolderProps) => void
    handleLike: (id: string, liked: boolean) => void
    handleActiveFolder: (id: string, isActive: boolean) => void
    folder: FirestoreCommunityFolderProps
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
    handleLike,
    handleActiveFolder
}: Props) => {


    return (
        <View className={`rounded-2xl space-y-2`}>
            <View
                className={`w-full py-1 px-2 flex-col h-36 relative items-center justify-between rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}
            >
                <TouchableOpacity
                    className='self-end'
                    onPress={() => onMoreDetailsPress({ ...folder, liked, active })}>
                    <Entypo name="dots-three-horizontal" size={20} color={active ? customColors.accent : colors.gray[500]} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onPress(folder)}
                    onLongPress={() => onMoreDetailsPress({ ...folder, liked, active })}>
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
                    <TouchableOpacity className='flex-row' onPress={() => handleLike(folder.id, liked)}>
                        <Entypo name="heart" size={20} color={liked ? customColors.accent : colors.gray[500]} />
                        <Counter count={folder.likes.length} liked={liked} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row' onPress={() => handleActiveFolder(folder.id, active)}>
                        <Fontisto name="radio-btn-active" size={20} color={active ? customColors.accent : colors.gray[500]} />
                        <Counter count={folder.activeCount && folder.activeCount.length} liked={active} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default CommunityGoal