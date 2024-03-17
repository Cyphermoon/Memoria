import { CustomCommunityFolderProps, FolderProps } from '@components/Home/type'
import Text from '@components/common/Text'
import { FontAwesome6 } from '@expo/vector-icons'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { useIsFocused } from '@react-navigation/native'
import colors from 'colors'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import { useActiveFolderId } from 'src/util/HomeDrawer/index.hook'
import { useAuthStore } from 'store/authStore'

//TODO: Add interaction functionalities to this screen (edit, delete, like, unlike, etc)

type Props = DrawerScreenProps<HomeDrawerParamList, "Community">

const ActiveCollectionScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets()
    const bottomTabBar = useBottomTabBarHeight()

    const userId = useAuthStore(state => state.user?.uid)
    const activeFolder = useActiveFolderId(userId)
    const isFocused = useIsFocused()
    const [likedFolder, setLikedFolder] = useState<FolderProps | CustomCommunityFolderProps | null>()

    useEffect(() => {
        if (!isFocused) return
        let folderRef;
        if (activeFolder?.folderCategory === 'personal' && userId && activeFolder?.folderId) {
            folderRef = doc(firestoreDB, 'users', userId, 'folders', activeFolder.folderId);
        } else if (activeFolder?.folderCategory === 'community') {
            folderRef = doc(firestoreDB, 'community', activeFolder.folderId);
        }

        if (folderRef) {
            const unsubscribe = onSnapshot(folderRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setLikedFolder({ id: docSnapshot.id, ...docSnapshot.data() } as any);
                } else {
                    console.log(`No document found with id: ${activeFolder?.folderId}`);
                }
            });

            // Clean up the onSnapshot listener when the component is unmounted or the dependencies change
            return () => {
                unsubscribe();
            };
        }
    }, [userId, activeFolder, isFocused]);

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: bottomTabBar + insets.bottom
            }}
            className='bg-primary flex-grow px-4'>
            <TouchableOpacity onPress={() => navigation.openDrawer()} className='rotate-180 mr-auto'>
                <FontAwesome6 name="bars-staggered" size={26} color={colors.secondary} />
            </TouchableOpacity>


            {activeFolder && <Text className='text-center text-3xl font-bold mt-8 mb-8'>Your Active Folder</Text>}

            {likedFolder ?
                <View className='bg-primary-300 rounded-2xl p-2 border border-accent h-40 flex flex-col justify-between'>
                    <Text className='invisible text-primary-300'>padding</Text>
                    <Text className='text-accent text-center text-medium text-2xl mb-6 justify-self-center'>{likedFolder?.name}</Text>
                    <Text className='text-accent'>{likedFolder.items} items</Text>
                </View> :
                <Text className='text-center text-3xl font-bold mt-8 mb-8'>No Active Folder</Text>
            }

            {activeFolder &&
                <View>
                    <Text className='text-center mt-8'>This folder is in the <Text className='text-accent'>{activeFolder?.folderCategory}</Text> collection
                    </Text>
                </View>
            }
        </View>
    )
}

export default ActiveCollectionScreen