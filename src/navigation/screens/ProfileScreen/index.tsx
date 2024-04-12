import ProfileItem from '@components/Profile/ProfileItem'
import Text from '@components/common/Text'
import { Image } from 'expo-image'
import React, { useEffect } from 'react'
import { Linking, Platform, ScrollView, Share, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from 'store/authStore'
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import colors from 'tailwindcss/colors'
import { deleteImageFromCloudinary, uploadImage } from 'src/util/HomeDrawer/addGoalItem.util'
import { CloudinaryResponse } from 'src/util/HomeDrawer/type'
import { logUserOut, updateUser } from 'src/util/user/userFirestore.util'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { MainBottomTabNavigatorParamList } from 'src/navigation/StackNavigator/MainBottomTabStackNavigator'
import { AuthStackParamList, HomeStackParamList, RootStackParamList } from 'type'

type AuthNavigationProps = NavigationProp<AuthStackParamList, "Auth">

const ProfileScreen = () => {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation<AuthNavigationProps>();
    const userName = useAuthStore(state => state.user?.username)
    const userId = useAuthStore(state => state.user?.uid)
    const _userImageUrl = useAuthStore(state => state.user?.image)

    const [userImage, setUserImage] = React.useState<CloudinaryResponse | undefined>(_userImageUrl)
    const BASE_URL = 'https://memoria-landing-page.vercel.app'

    async function handleProfileChange() {
        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        // If the user didn't cancel the picker, set the image
        if (!result.canceled) {
            // Delete the previous image from cloudindary
            if (userImage) {
                await deleteImageFromCloudinary(userImage.public_id)
            }
            const imageUrl = result.assets[0].uri
            // Upload the new image to cloudinary
            const cloudinaryImage = await uploadImage(imageUrl, 'file', userName || "profile-name")
            // Set the user image
            setUserImage(cloudinaryImage);
            // Update the user image in firestore
            userId && updateUser(userId, { image: cloudinaryImage })
        }
    }

    function handleSignOut() {
        logUserOut()

        // Navigate to the login screen after 1.5 seconds
        setTimeout(() => {
            navigation.navigate('Login')
        }, 1500)
    }

    useEffect(() => {
        setUserImage(_userImageUrl)
    }, [_userImageUrl])


    return (
        <View
            className='bg-primary px-4 flex-grow'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>

            <View className='flex-row items-center mb-5 mt-16 rounded-lg px-3 py-1.5'>

                <TouchableOpacity onPress={handleProfileChange}>
                    {userImage ? (
                        <Image
                            source={{ uri: userImage.secure_url }}
                            className='w-16 h-16 rounded-full mr-3 border-gray-400 border-2'
                        />
                    ) : (
                        <View className='relative w-16 h-16 rounded-full mr-3 border-gray-400 border-2 bg-primary-300 items-center justify-center p-1'>
                            <Text className='text-[10px] text-center text-gray-400'>Update profile here</Text>
                            <View className='absolute top-0 right-0 rounded-full'>
                                <Entypo name="edit" size={18} color={colors.gray['400']} />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <Text className='text-xl font-semibold text-gray-300'>{userName}</Text>
            </View>

            {/*Action Section */}
            <View className='mb-8'>
                <Text className='uppercase font-semibold text-xs text-gray-500 ml-3 mb-1.5'>Action</Text>
                <ProfileItem onPress={() => {
                    Share.share({
                        message: 'Check out Memoria, the best app for setting and tracking your goals!',
                        url: BASE_URL
                    });
                }} text='Share with Friends' />
                {Platform.OS === 'ios' && <ProfileItem onPress={() => { }} text='Wallpaper Automation' />}

            </View>

            {/*Legal Section */}
            <View className='mb-8'>
                <Text className='uppercase font-semibold text-xs text-gray-500 ml-3 mb-1.5'>Legal</Text>
                <ProfileItem onPress={() => { Linking.openURL(`${BASE_URL}/privacy`) }} text='Privacy Policy' />
                <ProfileItem onPress={() => { Linking.openURL(`${BASE_URL}/image-copyright`) }} text='AI Image Copyright' />
            </View>

            {/*Account Section */}

            <TouchableOpacity className='' onPress={() => { handleSignOut() }}>
                <Text className='text-red-500 text-center'>Log Out</Text>
            </TouchableOpacity>

        </View>
    )
}

export default ProfileScreen