import FormControl from '@components/common/FormControl'
import Touchable from '@components/common/Touchable'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList, RootStackParamList } from '../../../../type'
import Checkbox from '../../../components/common/Checkbox'
import Logo from '../../../components/common/Logo'
import Text from '../../../components/common/Text'
import { validateInputs } from 'src/util'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from 'firebaseConfig'
import { NativeStackScreenProps } from '@react-navigation/native-stack'


type Props = NativeStackScreenProps<AuthStackParamList, "Login">


const LoginScreen = ({ navigation }: Props) => {
    // form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit() {
        // Validate the inputs
        const errorMessage = validateInputs({ email, password });
        if (errorMessage) {
            Alert.alert(errorMessage);
            return;
        }


        // Get the Firebase auth instance
        try {
            // Register the user
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            // Signed in 
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                className='flex-grow'
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <SafeAreaView className='flex-grow flex flex-col justify-center items-center bg-primary'>
                    <View className='w-full px-4'>
                        <View className='mb-6'>
                            <Logo withName size='md' />
                            <Text className='text-xl font-medium text-center' >Sign In</Text>
                        </View>

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
                                        type="password"
                                        variant="outline"
                                        value={password}
                                        onChange={setPassword}
                                    />
                                </View>
                            </View>
                            <View>
                                <Touchable onPress={handleSubmit} isText>Login</Touchable>

                                <View className='flex flex-row items-center justify-center mt-5'>
                                    <Text className='text-gray-400'>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
                                        <Text className='underline'>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                </SafeAreaView >
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    )
}

export default LoginScreen