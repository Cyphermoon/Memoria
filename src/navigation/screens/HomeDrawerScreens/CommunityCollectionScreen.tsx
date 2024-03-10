import CommunityGoal from '@components/Home/CommunityGoal'
import Text from '@components/common/Text'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import customColors from 'colors'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestoreDB } from 'firebaseConfig'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { sortOptions } from 'settings'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import { HomeStackParamList } from 'type'
import GoalActionItem from '../../../components/Home/GoalActionItem'
import NewGoal from '../../../components/Home/NewGoal'
import { CommunityFolderProps, SelectedFolderProps, SortOptionProp } from '../../../components/Home/type'
import CustomBottomSheetModal from '../../../components/common/CustomBottomSheetModal'
import HeaderContent, { Header } from './HomeDrawerLayout'
import { useAuthStore } from 'store/authStore'
import { deleteCommunityFolder, handleSortChanged } from 'src/util/HomeDrawer/index.utll'



type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, "HomeDrawer">
type Props = DrawerScreenProps<HomeDrawerParamList, "Community">


const CommunityCollectionScreen = ({ navigation: drawerNavigation }: Props) => {
    const navigation = useNavigation<HomeScreenNavigationProp>()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '30%'], []);

    const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0])
    const [selectedFolder, setSelectedFolder] = useState<CommunityFolderProps | undefined | null>(undefined)
    const [folders, setFolders] = useState<CommunityFolderProps[] | null>(null);

    const userId = useAuthStore(state => state.user?.uid)

    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });


    useEffect(() => {
        // Get a reference to the user's document
        if (!userId) return
        const userDocRef = doc(firestoreDB, 'users', userId);

        // Listen for real-time changes to the communitySort property
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                // Update currentSortOption with the new communitySort value
                const communitySort = docSnapshot.data()?.communitySort;
                if (communitySort) {
                    setCurrentSortOption(communitySort);
                } else {
                    handleSortChanged(sortOptions[0], userId)

                }
            }
        });

        // Return a cleanup function to unsubscribe when the component unmounts
        return unsubscribe;
    }, [userId]);


    useEffect(() => {
        /*
            Get the community collection in real-time from firestore while simoultaneously sorting the array
        */
        const firebaseValueMap = {
            name_desc: "name",
            date_desc: "dateCreated",
            size_desc: "items"
        }

        /// get community folder ref
        const folderRef = collection(firestoreDB, "community");
        const q = query(folderRef, orderBy(firebaseValueMap[currentSortOption.id as keyof typeof firebaseValueMap], "desc"))

        // watch for changes and update the folders state
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const folders: CommunityFolderProps[] = [];

            querySnapshot.forEach((doc) => {
                folders.push({ id: doc.id, ...doc.data() } as CommunityFolderProps);
            });

            setFolders(folders);
        });

        // unsubscribe from the collection when component unmounts
        return () => {
            unsubscribe();
        };

    }, [currentSortOption])

    function handleOpenPress() {
        bottomSheetModalRef.current?.present()
    }

    function handleClosePress() {
        bottomSheetModalRef.current?.dismiss()
    }

    function handleSortPress(option: SortOptionProp) {
        handleSortChanged(option, userId)
    }

    function handleMoreDetailsPress(goal: CommunityFolderProps) {
        setSelectedFolder(goal)
        handleOpenPress()
    }

    function handleUseCollection() {
        console.log("Delete Goal: ", selectedFolder?.id)
    }

    function handleLikeCollection() {
        setFolders(prevGoals => prevGoals ? prevGoals.map(goal => {
            if (goal.id.toString() === selectedFolder?.id.toString()) {
                return { ...goal, liked: true };
            } else {
                return goal;
            }
        }) : null);
        handleClosePress()
    }

    function handleGoalPress(goal: SelectedFolderProps) {
        navigation.navigate("Goal", goal)
    }

    function handleFolderEdit() {
        if (!selectedFolder) return
        navigation.navigate("AddCollection", { mode: "community", folder: selectedFolder })
        handleClosePress()
    }

    function handleFolderDelete() {
        selectedFolder && deleteCommunityFolder(selectedFolder?.id)
        handleClosePress()
    }


    return (
        <View className='flex-grow bg-primary relative'>

            <Header
                navigationTitle='Community Collection'
                scrollY={scrollY}
                openDrawer={() => drawerNavigation.openDrawer()}
            />

            {folders && currentSortOption !== undefined ?
                <Animated.FlatList
                    data={folders}
                    keyExtractor={(item) => item.id.toString()}

                    numColumns={1}
                    ListFooterComponent={() => <View className='h-20' />}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <HeaderContent
                            navigationTitle='Community Collection'
                            handleSortPress={handleSortPress}
                            currentSortOption={currentSortOption}
                            marginBottom={36}
                        />
                    )}
                    renderItem={({ item }) => (
                        <View className='px-3 mb-7'>
                            <CommunityGoal
                                folder={item}
                                active={true}
                                liked={true}
                                onPress={handleGoalPress}
                                onMoreDetailsPress={handleMoreDetailsPress}
                                handleLike={handleLikeCollection}
                            />
                        </View>
                    )}
                /> :
                <Text>There are no community folders</Text>}

            <NewGoal mode="community" />

            {/* Goal Bottom Sheet */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Community Folder Actions' >
                {selectedFolder &&

                    <View>
                        <GoalActionItem
                            onPress={handleLikeCollection}
                            icon={(color, size) =>
                                <MaterialIcons
                                    name="favorite"
                                    size={size}
                                    color={true ? customColors.accent : color} />}
                            label={true ? 'Unlike Collection' : 'Like Collection'}
                            selectedFolder={selectedFolder.id} />

                        <GoalActionItem
                            onPress={handleUseCollection}
                            icon={(color, size) => <Fontisto name="radio-btn-active" size={size} color={color} />}
                            label='Use Collection'
                            selectedFolder={selectedFolder.id} />
                        {selectedFolder?.user.id === userId &&
                            <>
                                <GoalActionItem
                                    onPress={handleFolderEdit}
                                    icon='edit'
                                    label='Edit'
                                    selectedFolder={selectedFolder} />

                                <GoalActionItem
                                    onPress={handleFolderDelete}
                                    icon='delete'
                                    label='Delete'
                                    selectedFolder={selectedFolder}
                                    danger />
                            </>
                        }


                    </View>
                }
            </CustomBottomSheetModal>
        </View>
    )
}

export default CommunityCollectionScreen
