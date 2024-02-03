import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from '../components/common/Logo'
import Text from '../components/common/Text'
import SocialButton from '../components/Auth/SocialButton'
import Checkbox from '../components/common/Checkbox'

const AuthScreen = () => {
    const [isChecked, setIsChecked] = useState(true);

    const handleCheck = () => {
        setIsChecked(!isChecked);
    };
    function handleSignIn(signInHandler: () => void) {
        // Higher order function using currying to handle sign in
        return () => {
            if (!isChecked) {
                Alert.alert('Terms and Conditions', 'You need to agree to our terms and conditions to continue');
            } else {
                signInHandler();
            }
        };
    }

    function handleGoogleSignIn() {
        // Handle Google Sign Up
    }

    function handleTwitterSignIn() {
        // Handle Twitter Sign Up
    }

    function handleLinkedinSignIn() {
        // Handle Google Sign Up
    }


    return (
        <SafeAreaView className='flex-grow flex flex-col justify-center items-center bg-primary'>
            <View className='w-full px-4'>
                <View className='mb-16'>
                    <Logo withName size='md' />
                    <Text className='text-xl font-medium text-center' >Continue Authentication</Text>
                </View>

                <View className='w-full'>
                    <SocialButton
                        icon="google"
                        text="Sign up with Google"
                        color="bg-white"
                        textClass='text-gray-900'
                        onPress={handleSignIn(handleGoogleSignIn)}
                    />
                    <SocialButton
                        icon="twitter"
                        text="Sign up with Twitter"
                        color="bg-blue-400"
                        onPress={handleSignIn(handleTwitterSignIn)}
                    />
                    <SocialButton
                        icon="linkedin"
                        text="Sign up with LinkedIn"
                        color="bg-blue-700"
                        onPress={handleSignIn(handleLinkedinSignIn)}
                    />

                    <Checkbox
                        isChecked={isChecked}
                        onCheck={handleCheck}>
                        <Text className='text-gray-300'>By signing up, you agree to our <Text className='text-white'>Terms of Service</Text> and <Text className='text-white'>Privacy Policy</Text></Text>
                    </Checkbox>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AuthScreen