import ProfileItem from '@components/Profile/ProfileItem'
import Text from '@components/common/Text'
import Touchable from '@components/common/Touchable'
import { Image } from 'expo-image'
import React from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProfileScreen = () => {
    const insets = useSafeAreaInsets()
    return (
        <ScrollView
            className='flex-grow bg-primary px-4'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>
            <View className='flex-row items-center mb-5 mt-16 rounded-lg px-3 py-1.5'>
                <Image
                    source={'https://picsum.photos/id/237/200/300'}
                    className='w-16 h-16 rounded-full mr-3 border-gray-400 border-2'
                />
                <Text className='text-xl font-semibold text-gray-300'>Cypher Moon</Text>
            </View>

            {/*Action Section */}
            <View className='mb-8'>
                <Text className='uppercase font-semibold text-xs text-gray-500 ml-3 mb-1.5'>Action</Text>
                <ProfileItem onPress={() => { }} text='Share with Friends' />
                {Platform.OS === 'ios' && <ProfileItem onPress={() => { }} text='Wallpaper Automation' />}

            </View>

            {/*Legal Section */}
            <View className='mb-8'>
                <Text className='uppercase font-semibold text-xs text-gray-500 ml-3 mb-1.5'>Legal</Text>
                <ProfileItem onPress={() => { }} text='Terms of Service' />
                <ProfileItem onPress={() => { }} text='Privacy Policy' />
                <ProfileItem onPress={() => { }} text='AI Image Copyright' />
            </View>

            {/*Account Section */}
            <ProfileItem
                onPress={() => { }}
                showIcon={false}
                textCenter
                text='Logout'
            />

            <TouchableOpacity className='' onPress={() => { }}>
                <Text className='text-red-500 text-center'>Delete Account</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ProfileScreen