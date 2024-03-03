import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../../type'
import SocialButton from '../../components/Auth/SocialButton'
import Checkbox from '../../components/common/Checkbox'
import Logo from '../../components/common/Logo'
import Text from '../../components/common/Text'
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from 'firebaseConfig'
import { TextInput } from 'react-native-gesture-handler'
import FormControl from '@components/common/FormControl'
import Touchable from '@components/common/Touchable'
import { TouchableWithoutFeedback } from 'react-native'




type RootStackNavigationProp = NavigationProp<RootStackParamList, "AuthNavigator">


const AuthScreen = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigation = useNavigation<RootStackNavigationProp>()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleCheck() {
        setIsChecked(!isChecked);
    }

    // function handleSignIn(signInHandler: () => void) {
    //     // Higher order function using currying to handle sign in
    //     return () => {
    //         if (!isChecked) {
    //             Alert.alert('Terms and Conditions', 'You need to agree to our terms and conditions to continue')
    //         } else {
    //             // navigation.navigate('HomeNavigator')
    //             signInHandler()
    //         }
    //     };
    // }

    // function handleGoogleSignIn() {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(firebaseAuth, provider)
    //         .then((result) => {
    //             // This gives you a Google Access Token. You can use it to access the Google API.
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential?.accessToken;
    //             // The signed-in user info.
    //             const user = result.user;
    //             // ...
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.email;
    //             // The AuthCredential type that was used.
    //             const credential = GoogleAuthProvider.credentialFromError(error);
    //             // ...
    //         });
    // }

    // function handleTwitterSignIn() {
    //     const provider = new TwitterAuthProvider();
    //     signInWithPopup(firebaseAuth, provider)
    //         .then((result) => {
    //             // This gives you a Twitter Access Token. You can use it to access the Twitter API.
    //             const credential = TwitterAuthProvider.credentialFromResult(result);
    //             const token = credential?.accessToken;
    //             // The signed-in user info.
    //             const user = result.user;
    //             // ...
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.email;
    //             // The AuthCredential type that was used.
    //             const credential = TwitterAuthProvider.credentialFromError(error);
    //             // ...
    //         });
    // }
    // function handleGitHubSignIn() {
    //     const provider = new GithubAuthProvider();
    //     signInWithPopup(firebaseAuth, provider)
    //         .then((result) => {
    //             // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    //             const credential = GithubAuthProvider.credentialFromResult(result);
    //             const token = credential?.accessToken;
    //             // The signed-in user info.
    //             const user = result.user;
    //             // ...
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.email;
    //             // The AuthCredential type that was used.
    //             const credential = GithubAuthProvider.credentialFromError(error);
    //             // ...
    //         });
    // }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                className='flex-grow'
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <SafeAreaView className='flex-grow flex flex-col justify-center items-center bg-primary'>
                    <View className='w-full px-4'>
                        <View className='mb-6'>
                            <Logo withName size='md' />
                            <Text className='text-xl font-medium text-center' >Continue Authentication</Text>
                        </View>

                        {/* <View className='w-full'>
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
                        color="bg-[#1D9BF0]"
                        onPress={handleSignIn(handleTwitterSignIn)}
                    />
                    <SocialButton
                        icon="github"
                        text="Sign up with Github"
                        color="bg-[#24292e]"
                        onPress={handleSignIn(handleGitHubSignIn)}
                    />

                    <Checkbox
                        isChecked={isChecked}
                        onCheck={handleCheck}>
                        <Text className='text-gray-300'>By signing up, you agree to our <Text className='text-white'>Terms of Service</Text> and <Text className='text-white'>Privacy Policy</Text></Text>
                    </Checkbox>
                </View> */}

                        <View>
                            <View className='mb-6'>
                                <View className='mb-6'>
                                    <FormControl
                                        label="Email"
                                        type="email"
                                        variant="outline"
                                        value={email}
                                        onChange={setEmail}
                                    />

                                </View>

                                <View className='mb-6'>
                                    <FormControl
                                        label="Password"
                                        type="type"
                                        variant="outline"
                                        value={password}
                                        onChange={setPassword}
                                    />
                                </View>


                                <Checkbox
                                    isChecked={isChecked}
                                    onCheck={handleCheck}>
                                    <Text className='text-gray-300'>By signing up, you agree to our <Text className='text-white'>Terms of Service</Text> and <Text className='text-white'>Privacy Policy</Text></Text>
                                </Checkbox>
                            </View>
                            <View>
                                <Touchable isText>Create Account</Touchable>
                            </View>
                        </View>
                    </View>

                </SafeAreaView >
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    )
}

export default AuthScreen