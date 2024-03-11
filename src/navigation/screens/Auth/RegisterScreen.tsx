import FormControl from '@components/common/FormControl'
import Touchable from '@components/common/Touchable'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import colors from 'colors'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Toast from 'react-native-root-toast'
import { SafeAreaView } from 'react-native-safe-area-context'
import { validateInputs } from 'src/util'
import { createUser } from 'src/util/firebase.util'
import tailwindColors from 'tailwindcss/colors'
import { AuthStackParamList, RootStackParamList } from '../../../../type'
import Checkbox from '../../../components/common/Checkbox'
import Logo from '../../../components/common/Logo'
import Text from '../../../components/common/Text'
import { errorToast, successToast } from 'src/util/toast.util'
import { FirebaseError } from 'firebase/app'
import ProtectedScreen from './ProtectedScreen'


type Prop = NativeStackScreenProps<AuthStackParamList, "Auth">
type RegisterScreenNavigationProp = NavigationProp<RootStackParamList, "HomeNavigator">

const RegisterScreen = ({ navigation }: Prop) => {
    const [isChecked, setIsChecked] = useState(false);
    const rootNavigation = useNavigation<RegisterScreenNavigationProp>()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    function handleCheck() {
        setIsChecked(!isChecked);
    }

    async function handleSubmit() {
        // Validate the inputs
        const errorMessage = validateInputs({ email, password, username });
        if (errorMessage) {
            Alert.alert(errorMessage);
            return;
        }

        if (!isChecked) {
            Alert.alert('Terms and Conditions', 'You need to agree to our terms and conditions to continue')
            return;
        }

        // Get the Firebase auth instance
        try {
            // Register the user
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

            if (!userCredential.user) return;

            // Create user profile
            createUser({ username, email, uid: userCredential.user.uid })
                .then((wasSuccessful) => {
                    if (wasSuccessful) {
                        // send toast
                        successToast('Account created successful')

                        // Clear the input
                        setEmail('')
                        setPassword('')
                        setUsername('')
                        setIsChecked(false)

                        // navigation to home
                        rootNavigation.navigate('HomeNavigator')
                    }
                })
                .catch(() => errorToast('Account creation failed, Please try again'))
                .finally(() => Keyboard.dismiss())

            // Signed in 
        } catch (error: any) {
            Keyboard.dismiss()

            if (error instanceof FirebaseError) {
                if (error.code === 'auth/email-already-in-use') {
                    errorToast('This email address already exists')
                }
            } else {
                errorToast("An error occured, please try again later")
            }
        }
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
        <ProtectedScreen>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    className='flex-grow'
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <SafeAreaView className='flex-grow flex flex-col justify-center items-center bg-primary'>
                        <View className='w-full px-4'>
                            <View className='mb-6'>
                                <Logo withName size='md' />
                                <Text className='text-xl font-medium text-center' >Sign up</Text>
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
                                            label="Username"
                                            type="username"
                                            variant="outline"
                                            value={username}
                                            onChange={setUsername}
                                        />

                                    </View>
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
                                            type="password"
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
                                    <Touchable onPress={handleSubmit} isText>Create Account</Touchable>

                                    <View className='flex flex-row items-center justify-center mt-5'>
                                        <Text className='text-gray-400'>Already have an Account? </Text>

                                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                            <Text className='underline'>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </SafeAreaView >
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ProtectedScreen>

    )
}

export default RegisterScreen