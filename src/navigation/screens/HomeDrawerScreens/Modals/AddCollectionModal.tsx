import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Text from '../../../../components/common/Text';
import Touchable from '../../../../components/common/Touchable';
import colors from 'tailwindcss/colors'
import customColors from '../../../../../colors'
import { HomeStackParamList } from '../../../../../type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import PublishCollectionModeSelector from '@components/Home/PublishCollectionModeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationState } from '@react-navigation/native';


type Props = NativeStackScreenProps<HomeStackParamList, 'AddCollection'>;

const AddCollectionModal = ({ navigation, route }: Props) => {
    const [folderName, setFolderName] = useState('')
    const [selectedMode, setSelectedMode] = useState({ label: 'Personal', value: 'personal' })
    const [isActive, setIsActive] = useState(false)
    const insets = useSafeAreaInsets()

    function toggleSwitch() {
        setIsActive(active => !active)
    }

    function addCollection() {
        setFolderName('')
        navigation.canGoBack() && navigation.goBack()
    }

    useEffect(() => {
        const mode = route.params.mode
        if (!mode) return
        if (mode === "personal") setSelectedMode({ label: 'Personal', value: 'personal' })
        else if (mode === "community") setSelectedMode({ label: 'Community', value: 'community' })
    }, [])

    return (
        <TouchableWithoutFeedback onPress={() => folderName && Keyboard.dismiss()}>
            <View
                className='flex-grow bg-primary'
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}>
                <View className='p-4 justify-between flex-grow'>
                    <View>
                        <View className='flex-row items-center justify-between mb-14'>
                            <Text className='text-center font-medium flex-grow text-2xl  text-gray-300'>
                                New Collection
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

                        <PublishCollectionModeSelector
                            selectedMode={selectedMode}
                            handleImageSelected={setSelectedMode} />


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
            </View>
        </TouchableWithoutFeedback>
    );
};

export default AddCollectionModal;