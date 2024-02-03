import { Image } from 'expo-image';
import React from 'react';
import { View, Text, } from 'react-native';
import { getInitials } from '../../util';

interface UserAvatarProps {
    imageUrl?: string;
    username: string;
}


const UserAvatar: React.FC<UserAvatarProps> = ({ imageUrl, username }) => {

    const initials = getInitials(username);

    return (
        <View className='w-10 h-10 rounded-full justify-center items-center bg-primary-300'>
            {imageUrl ? (
                <Image source={imageUrl} className='w-full h-full rounded-full' />
            ) : (
                <Text className='text-white text-center'>{initials}</Text>
            )}
        </View>
    );
};

export default UserAvatar;