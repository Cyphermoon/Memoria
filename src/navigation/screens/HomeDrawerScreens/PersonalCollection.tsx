import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { sortOptions } from 'settings'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import { HomeStackParamList } from 'type'
import { FolderProps, SelectedFolderProps, SortOptionProp } from '../../../components/Home/type'

import Goal from '@components/Home/Goal'
import GoalActionItem from '@components/Home/GoalActionItem'
import NewGoal from '@components/Home/NewGoal'
import CustomBottomSheetModal from '@components/common/CustomBottomSheetModal'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import HeaderContent, { Header } from './HomeDrawerLayout'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestoreDB } from 'firebaseConfig'
import { useAuthStore } from 'store/authStore'
import Text from '@components/common/Text'
import { deleteFolder } from 'src/util/HomeDrawer/index.utll'
import { useActiveFolderId } from 'src/util/HomeDrawer/index.hook'


// Screen Types
type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, "HomeDrawer">
type Props = DrawerScreenProps<HomeDrawerParamList, "Personal">



//constants

const HomeScreen = ({ navigation: drawerNavigation }: Props) => {
    const userId = useAuthStore(state => state.user?.uid)
    const [folders, setFolders] = useState<FolderProps[] | null>(null)

    const navigation = useNavigation<HomeScreenNavigationProp>()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);

    const [selectedFolder, setSelectedFolder] = useState<FolderProps | null>(null)
    const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0])

    const scrollY = useSharedValue(0)
    const activeFolderId = useActiveFolderId(userId)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    useEffect(() => {
        console.log("Active Folder Id: ", activeFolderId)
        if (!userId) return
        const folderRef = collection(firestoreDB, "users", userId, "folders"); // Replace with your actual user and folder IDs

        const unsubscribe = onSnapshot(folderRef, (querySnapshot) => {
            const folders: FolderProps[] = [];

            querySnapshot.forEach((doc) => {
                folders.push({ id: doc.id, ...doc.data() } as FolderProps);
            });

            setFolders(folders);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [])



    function handleOpenPress() {
        bottomSheetModalRef.current?.present()
    }

    function handleClosePress() {
        bottomSheetModalRef.current?.dismiss()
    }

    function handleSortPress(option: SortOptionProp) {
        setCurrentSortOption(option)
    }

    function handleMoreDetailsPress(goal: FolderProps) {
        setSelectedFolder(goal)
        handleOpenPress()
    }

    async function handleGoalDelete(folder: FolderProps) {
        userId && selectedFolder?.id && deleteFolder(userId, selectedFolder?.id)
        handleClosePress()
    }

    function handleGoalEdit(folder: FolderProps) {
        navigation.navigate("AddCollection", {
            mode: 'personal',
            folder: {
                ...folder,
                active: activeFolderId === selectedFolder?.id
            }
        })
        handleClosePress()
    }


    function handleGoalPress(goal: FolderProps) {
        navigation.navigate("Goal", { id: goal.id, name: goal.name })
    }


    return (
        <View
            className='flex-grow bg-primary relative'>

            <Header
                navigationTitle='Personal Collection'
                scrollY={scrollY}
                openDrawer={() => drawerNavigation.openDrawer()}
            />

            {folders ?
                <Animated.FlatList
                    data={folders}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.container}
                    columnWrapperStyle={styles.columnWrapper}
                    numColumns={2}
                    ListFooterComponent={() => <View className='h-20' />}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    ListHeaderComponent={() => (
                        <HeaderContent
                            navigationTitle='Personal Collection'
                            handleSortPress={handleSortPress}
                            currentSortOption={currentSortOption}
                        />
                    )}
                    renderItem={({ item }) => (
                        <View className='w-1/2 p-2'>
                            <Goal
                                selectedFolder={item}
                                active={item.id === activeFolderId}
                                onPress={handleGoalPress}
                                onMoreDetailsPress={handleMoreDetailsPress}
                            />
                        </View>
                    )}
                /> :
                <View>
                    <Text>Your personal collection empty</Text>
                </View>
            }

            <NewGoal mode='personal' />

            {/* Goal Bottom Sheet */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Goal Actions' >
                {selectedFolder &&

                    <View>
                        <GoalActionItem
                            onPress={handleGoalEdit}
                            icon='edit'
                            label='Edit'
                            selectedFolder={selectedFolder} />

                        <GoalActionItem
                            onPress={handleGoalDelete}
                            icon='delete'
                            label='Delete'
                            selectedFolder={selectedFolder}
                            danger />
                    </View>
                }
            </CustomBottomSheetModal>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginBottom: 100
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    item: {
        marginBottom: 10,
    },
});

