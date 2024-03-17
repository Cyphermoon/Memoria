import { FontAwesome6 } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, FlatList, SafeAreaView, View } from 'react-native'
import { intervalOptions } from 'settings'
import colors from 'tailwindcss/colors'
import { HomeStackParamList } from '../../../../type'
import GoalItem from '../../../components/Goal/GoalItem'
import IntervalSelector from '../../../components/Goal/IntervalSelector'
import { IntervalOptionProps } from '../../../components/Goal/type'
import SearchBar from '../../../components/common/SearchBar'
import Text from '../../../components/common/Text'
import Touchable from '../../../components/common/Touchable'
import { useSlidePosition } from '../../../context/SlidePositionProvider'
import { FolderItemProps } from 'src/util/HomeDrawer/type'
import { CollectionReference, collection, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from 'firebaseConfig'
import { useAuthStore } from 'store/authStore'
import { deleteFolderItem, deleteImageFromCloudinary } from 'src/util/HomeDrawer/addGoalItem.util'
import { errorToast } from 'src/util/toast.util'



type Props = NativeStackScreenProps<HomeStackParamList, "Goal">


const GoalScreen = ({ route, navigation }: Props) => {
    const ref = useRef<FlatList<any> | null>(null)
    const { position } = useSlidePosition()
    const userId = useAuthStore(state => state.user?.uid);

    const [selectedInterval, setSelectedInterval] = useState<IntervalOptionProps>(intervalOptions[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [folderItems, setFolderItems] = useState<FolderItemProps[]>([]);


    useEffect(() => {
        if (!userId) return

        // initialize the folderItem reference
        let folderItemRef: CollectionReference | null = null

        // update the folderItem reference based on the folder mode
        if (route.params.folder.mode === 'personal') {
            folderItemRef = collection(firestoreDB, "users", userId, "folders", route.params.folder.id, "items");
        } else if (route.params.folder.mode === 'community') {
            folderItemRef = collection(firestoreDB, "community", route.params.folder.id, "items");
        }

        // exit the the code if for some reason the folderItemRef is null
        if (!folderItemRef) return

        //use a snapshot to listen to changes in the folderItem collection
        const unsubscribe = onSnapshot(folderItemRef, (querySnapshot) => {
            const items: FolderItemProps[] = [];

            querySnapshot.forEach((doc) => {
                // update the temporary items array with the data from the document
                items.push({ id: doc.id, ...doc.data() } as FolderItemProps);
            })

            // set the folderItems state with the items array
            setFolderItems(items)
        })
    }, [])

    const handleIntervalSelected = (interval: IntervalOptionProps) => {
        setSelectedInterval(interval);
        // You can add more logic here if needed
    };

    function movetoNewGoalItem() {
        navigation.navigate('NewGoalItem', {
            folder:
            {
                id: route.params.folder.id,
                type: route.params.folder.mode
            }
        })
    }

    //* Search Actions
    const handleSearchQueryChanged = (query: string) => {
        setSearchQuery(query);
        // Add any additional logic for handling search query changes here
    };

    function handleSearchSubmit() {
        console.log("Search submitted! ", searchQuery)
    }

    function handleSortPress(id: string) {
        console.log("Sort Pressed: ", id)
    }

    // Goal Items Actions
    function handleDelete(itemId: string, imageId: string) {

        const message = "Are you sure you want to delete this item";

        Alert.alert(
            "Delete Goal Item", // Alert title
            message, // Alert message
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            if (userId) {
                                await deleteImageFromCloudinary(imageId)
                                await deleteFolderItem(userId, route.params.folder.id, itemId, route.params.folder.mode)
                            } else {
                                errorToast('User not found')
                            }
                        } catch (error) {
                            throw new Error(`${error}`)
                        }

                        // Add your delete logic here
                    }
                }
            ],
            { cancelable: false }
        );
    };

    function handleFullscreen(id: string) {
        navigation.navigate('GoalSlideShow', { currentId: id, goals: folderItems });
    };

    function handleEdit(goalItem: FolderItemProps) {
        navigation.navigate('EditGoalItem', { goalItem });
    }

    // FlatList Methods
    const getItemLayout = (data: ArrayLike<any> | null | undefined, index: number): {
        length: number, offset: number, index: number
    } => {
        const GOAL_ITEM_HEIGHT = 192

        return { length: GOAL_ITEM_HEIGHT, offset: GOAL_ITEM_HEIGHT * index, index }
    };

    const onScrollToIndexFailed = (info: { index: number, highestMeasuredFrameIndex: number, averageItemLength: number }) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            ref.current?.scrollToIndex({ index: info.index, animated: true });
        });

        console.error("Could not scroll to index", info.index);
    };


    //TODO uncomment later
    // useEffect(() => {
    //     if (ref.current) {
    //         ref.current.scrollToIndex({ index: position, animated: true })
    //     }

    // }, [position])


    return (
        <SafeAreaView className='bg-primary flex-grow'>
            <View className='px-1 flex-grow'>

                {/* Header Section */}
                <View className='flex-row justify-between items-center mb-8 mt-6'>
                    <Text className='text-4xl font-semibold'>{route.params?.folder.name}</Text>

                    <View className='flex-row items-center'>
                        <IntervalSelector
                            selectedInterval={selectedInterval}
                            handleIntervalSelected={handleIntervalSelected}
                        />

                        <Touchable className='flex-row ml-4' onPress={movetoNewGoalItem}>
                            <FontAwesome6 name="add" size={16} color={colors.gray[800]} />
                            <Text className='text-primary ml-2'>
                                New
                            </Text>
                        </Touchable>
                    </View>
                </View>


                {/* Search Bar */}
                <View className='mb-10'>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchQueryChanged}
                        handleSearchSubmit={handleSearchSubmit} />
                </View>


                {/* Goals List */}
                <View className='flex-grow h-96'>
                    {folderItems.length > 0 ?
                        <FlatList
                            ref={ref}
                            data={folderItems}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={() => <View className='h-10' />}
                            renderItem={({ item }) => (
                                <View className='relative w-full h-56 rounded-2xl'>
                                    <GoalItem
                                        id={item.id}
                                        name={item.description}
                                        image={item.image}
                                        onDelete={handleDelete}
                                        onFullscreen={handleFullscreen}
                                        onEdit={handleEdit} />
                                </View>
                            )}
                            getItemLayout={getItemLayout}
                            onScrollToIndexFailed={onScrollToIndexFailed}
                        /> :
                        <Text className='text-center text-lg'>There are no items here</Text>}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default GoalScreen