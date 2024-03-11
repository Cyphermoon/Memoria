import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import Text from '@components/common/Text'
import { useActiveFolderId } from 'src/util/HomeDrawer/index.hook'
import { useAuthStore } from 'store/authStore'
import { CustomCommunityFolderProps, FolderProps } from '@components/Home/type'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from 'firebaseConfig'

const ActiveCollectionScreen = () => {
    const insets = useSafeAreaInsets()
    const bottomTabBar = useBottomTabBarHeight()

    const userId = useAuthStore(state => state.user?.uid)
    const activeFolder = useActiveFolderId(userId)
    const [likedFolder, setLikedFolder] = useState<FolderProps | CustomCommunityFolderProps | null>()

    useEffect(() => {
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
    }, [userId, activeFolder]);

    useEffect(() => {
        console.log('activeFolder: ', activeFolder)
        console.log('likedFolder: ', likedFolder)
    }, [likedFolder])

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: bottomTabBar + insets.bottom
            }}
            className='bg-primary flex-grow'>

            <Text>Your Active Folder</Text>
        </View>
    )
}

export default ActiveCollectionScreen