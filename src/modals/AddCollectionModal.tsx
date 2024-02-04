import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, Switch, TextInput, View } from 'react-native';
import Text from '../components/common/Text';
import Touchable from '../components/common/Touchable';
import colors from 'tailwindcss/colors'

const AddCollectionModal = () => {
    const [folderName, setFolderName] = useState('')
    const [isActive, setIsActive] = useState(false)

    function toggleSwitch() {
        setIsActive(active => !active)
    }

    function addCollection() {
        console.log('Your new folder name is: ', folderName);
        setFolderName('')
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
                        <Text className='text-center font-medium text-2xl mb-14 text-gray-300'>New Folder</Text>

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
                                trackColor={{ false: '#0F1728', true: '#FFAEDC' }}
                                thumbColor={isActive ? '#030712' : colors.gray[300]}
                                ios_backgroundColor={'#0F1728'}
                                value={isActive}
                                onValueChange={toggleSwitch} />
                        </View>
                    </View>

                    <Touchable onPress={addCollection} disabled={folderName === ""}>
                        Add Collection
                    </Touchable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddCollectionModal;