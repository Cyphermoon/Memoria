import PublishCollectionModeSelector from '@components/Home/PublishCollectionModeSelector';
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Keyboard, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import customColors from '../../../../../colors';
import { HomeStackParamList } from '../../../../../type';
import Text from '../../../../components/common/Text';
import Touchable from '../../../../components/common/Touchable';
import { SelectedCollectionModeProps } from '@components/Home/type';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuthStore } from 'store/authStore';
import { editFolder, uploadFolder } from 'src/util/HomeDrawer/index.utll';
import { serverTimestamp } from 'firebase/firestore';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddCollection'>;

/*
This component is used to both add and edit a collection. Although it's original intention was to add collection
*/

const AddCollectionModal = ({ navigation, route }: Props) => {
    const [folderName, setFolderName] = useState('')
    const [selectedMode, setSelectedMode] = useState<SelectedCollectionModeProps>({ label: 'Personal', value: 'personal' })
    const [isActive, setIsActive] = useState(false)

    const isEditingMode = route.params.folder ? true : false

    const insets = useSafeAreaInsets()
    const bottomTabBarHeight = useBottomTabBarHeight()
    const userId = useAuthStore(state => state.user?.uid)

    function toggleSwitch() {
        setIsActive(active => !active)
    }

    async function addCollection() {
        if (!userId) return

        setFolderName('')

        if (!route.params.folder) {
            await uploadFolder(userId,
                {
                    mode: selectedMode.value,
                    name: folderName,
                    dateCreated: serverTimestamp()
                },
                isActive)
        } else {
            await editFolder(userId, route.params.folder.id, { mode: selectedMode.value, name: folderName }, isActive)
        }

        navigation.canGoBack() && navigation.goBack()
    }

    useEffect(() => {
        // stop prepopulating mode field if editing
        if (isEditingMode) return

        const mode = route.params.mode
        if (!mode) return
        if (mode === "personal") setSelectedMode({ label: 'Personal', value: 'personal' })
        else if (mode === "community") setSelectedMode({ label: 'Community', value: 'community' })

    }, [])

    useEffect(() => {
        // prepopulate fields if editing

        if (route.params.folder) {
            setFolderName(route.params.folder.name)
            setIsActive(route.params.folder.active)
            if (route.params.folder.mode === "personal") setSelectedMode({ label: 'Personal', value: 'personal' })
            else if (route.params.folder.mode === "community") setSelectedMode({ label: 'Community', value: 'community' })
        }
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
                                {isEditingMode ? "Edit" : "New"} Collection
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

                    <Touchable
                        isText
                        style={{ marginBottom: bottomTabBarHeight }}
                        onPress={addCollection}
                        disabled={folderName === ""}>
                        {isEditingMode ? "Edit" : "Add"} Collection
                    </Touchable>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default AddCollectionModal;