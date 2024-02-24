import Counter from '@components/common/Counter';
import UserAvatar from '@components/common/UserAvatar';
import { Entypo, Fontisto } from '@expo/vector-icons';
import customColors from 'colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { plural } from '../../util';
import Text from '../common/Text';
import { CommunitySelectedGoal } from './type';

interface Props {
    id: string
    className?: string
    onPress: (goal: CommunitySelectedGoal) => void
    onMoreDetailsPress: (goal: CommunitySelectedGoal) => void
    handleLike: (id: string) => void
    text: string
    active: boolean
    items: number
    liked: boolean
}

const CommunityGoal = ({
    className = "",
    onPress,
    text,
    active,
    items,
    id,
    onMoreDetailsPress,
    liked,
    handleLike
}: Props) => {
    const goal = { id, name: text, liked }

    return (
        <View className={`rounded-2xl space-y-2`}>
            <View
                className={`w-full py-1 px-2 flex-col h-36 relative items-center justify-between rounded-2xl bg-primary-300 ${active && "border border-accent"} ${className}`}
            >
                <TouchableOpacity
                    className='self-end'
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

                <View className='flex-row items-center justify-between w-full'>
                    <Text className={`text-sm ${active ? 'text-accent' : 'text-gray-500'}`}>
                        {items} {plural(items, "item")}
                    </Text>
                </View>
            </View>

            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center space-x-2'>
                    <UserAvatar username='Cypher_Moon' />
                    <Text className='text-sm text-gray-500'>Cypher Moon</Text>
                </View>

                <View className='space-x-10 flex-row items-center'>
                    <TouchableOpacity className='flex-row' onPress={() => handleLike(id)}>
                        <Entypo name="heart" size={20} color={liked ? customColors.accent : colors.gray[500]} />
                        <Counter count={12} liked={liked} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row'>
                        <Fontisto name="radio-btn-active" size={20} color={colors.gray[500]} />
                        <Counter count={12} liked={false} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default CommunityGoal