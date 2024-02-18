import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import Text from '../../../components/common/Text';
import Touchable from '../../../components/common/Touchable';
import colors from 'tailwindcss/colors'
import customColors from '../../../../colors'
import { RootStackParamList } from '../../../../type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCollection'>;

const AddCollectionModal = ({ navigation }: Props) => {
    const [folderName, setFolderName] = useState('')
    const [isActive, setIsActive] = useState(false)

    function toggleSwitch() {
        setIsActive(active => !active)
    }

    function addCollection() {
        setFolderName('')
        navigation.canGoBack() && navigation.goBack()
    }

    return (
        <SafeAreaView className='bg-primary flex-grow'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-grow'
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <View className='p-4 justify-between flex-grow'>
                    <View>
                        <View className='flex-row items-center justify-between mb-14'>
                            <Text className='text-center font-medium flex-grow text-2xl  text-gray-300'>
                                New Folder
                            </Text>

                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <FontAwesome name="times" size={29} color={customColors.secondary} />
                            </TouchableOpacity>
                        </View>

                        <View className='mb-14'>
                            <Text className='mb-2'>Name</Text>
                            <TextInput
                                value={folderName}
                                onChangeText={setFolderName}
                                placeholder='Enter your folder name'
                                placeholderTextColor={colors.gray[500]}
                                className='w-full bg-primary-300 px-2 py-4 text-secondary rounded-md' />
                        </View>

                        <View className='flex-col justify-center space-y-2'>
                            <Text>Active</Text>

                            <Switch
                                trackColor={{ false: customColors.primary["300"], true: '#FFAEDC' }}
                                thumbColor={isActive ? customColors.primary.DEFAULT : colors.gray[300]}
                                ios_backgroundColor={customColors.primary["300"]}
                                value={isActive}
                                onValueChange={toggleSwitch} />
                        </View>
                    </View>

                    <Touchable isText onPress={addCollection} disabled={folderName === ""}>
                        Add Collection
                    </Touchable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddCollectionModal;