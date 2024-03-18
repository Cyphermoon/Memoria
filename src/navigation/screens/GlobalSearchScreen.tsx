import Goal from '@components/Home/Goal';
import { CustomCommunityFolderProps, FirestoreCommunityFolderProps, FolderProps } from '@components/Home/type';
import FilterTag from '@components/common/FilterTag';
import SearchBar from '@components/common/SearchBar';
import Text from '@components/common/Text';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CollectionReference, DocumentData, Query, collection, doc, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore';
import { firestoreDB } from 'firebaseConfig';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomFireStoreUserProps, useAuthStore } from 'store/authStore';
import { HomeStackParamList } from 'type';
import { HomeDrawerParamList } from '../HomeDrawer';
import { useActiveFolderId } from 'src/util/HomeDrawer/index.hook';
import CommunityGoal from '@components/Home/CommunityGoal';
import { activateFolder, deActivateFolder, likeFolder, unLikeFolder } from 'src/util/HomeDrawer/index.utll';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import UserAvatar from '@components/common/UserAvatar';

//TODO Currently suspended. Would implement when I have the main goal of the app

type SearchFilterTypes = 'personal' | 'community' | 'users' | 'all';
type PersonalScreenNavigationProp = NavigationProp<HomeStackParamList, "Goal">

const GlobalSearchScreen = () => {
    const insets = useSafeAreaInsets();
    const personalScreenNavigation = useNavigation<PersonalScreenNavigationProp>();
    const bottomTabHeight = useBottomTabBarHeight();

    const userId = useAuthStore(state => state.user?.uid)
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter]  = useState<SearchFilterTypes>('personal');
    
    const activeFolder = useActiveFolderId(userId)

    // datas 
    const [personalFolders, setPersonalFolders] = useState<FolderProps[]>([]);
    const [communityFolders, setCommunityFolders] = useState<FirestoreCommunityFolderProps[]>([]);
    const [users, setUsers] = useState<CustomFireStoreUserProps[]>([]);

    const allFolders: any[] = [...personalFolders, ...communityFolders, ...users];
    const filteredFolders = allFolders.filter((folder) => {
        // Check if the active filter is 'all' or if the folder mode matches the active filter
        // If the folder mode is undefined, check if the folder uid is defined and the active filter is 'users'
        const filterCondition = activeFilter === 'all' || (folder.mode ? folder.mode === activeFilter : folder.uid !== undefined && activeFilter === 'users');

        // Check if the folder name or username includes the search query (case-insensitive)
        const searchCondition = folder.name?.toLowerCase().includes(searchQuery.toLowerCase()) || folder.username?.toLowerCase().includes(searchQuery.toLowerCase());

        // Return true if both conditions are met
        return filterCondition && searchCondition;
    })

    // fetch personal folders
    useEffect(() => {
        if (!userId) return;
        // stop execution if the active filter is any value other than 'personal' or 'all
        if(activeFilter !== 'personal' && activeFilter !== 'all') return;

        //query personal folder without limit if active filter is not all
        let personalRef: any = collection(firestoreDB, 'users', userId, 'folders')

        // if active filter is all, limit the query to 7
        if(activeFilter === 'all'){
            personalRef  = query(personalRef, limit(7))
        }

        // get personal folders from firestore
        getDocs(personalRef)
        .then((snapshot) => {
            const folders = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data() as object
                } as FolderProps
            })

            setPersonalFolders(folders)
        })
        .catch(err => console.log(err))

    }, [activeFilter])


    // fetch community folders
    useEffect(() => {
        if (!userId) return;
        // stop execution if the active filter is any value other than 'community' or 'all
        if(activeFilter !== 'community' && activeFilter !== 'all') return;

        //query community folder without limit if active filter is not all
        let communityRef: CollectionReference<DocumentData> | Query<DocumentData> = collection(firestoreDB, 'community')

        // if active filter is all, limit the query to 7
        if(activeFilter === 'all'){
            communityRef  = query(communityRef, limit(7))
        }

        // get community folders from firestore
        const unsubscribe = onSnapshot(communityRef, (snapshot) => {
            const folders = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data() as object
                } as CustomCommunityFolderProps
            });
    
            setCommunityFolders(folders);
        });
    
        // Clean up subscription on unmount
        return () => unsubscribe();

    }, [activeFilter])

    // fetch users
    useEffect(() => {
        if (!userId) return;
        // stop execution if the active filter is any value other than 'users' or 'all
        if(activeFilter !== 'users' && activeFilter !== 'all') return;

        //query users without limit if active filter is not all
        let usersRef: CollectionReference<DocumentData> | Query<DocumentData> = collection(firestoreDB, 'users')

        // if active filter is all, limit the query to 7
        if(activeFilter === 'all'){
            usersRef  = query(usersRef, limit(7))
        }

        // get users from firestore
        getDocs(usersRef)
        .then((snapshot) => {
            const users = snapshot.docs.map((doc) => {
                return {
                    uid: doc.id,
                    ...doc.data() as object
                } as CustomFireStoreUserProps
            })

            setUsers(users)
        })
        .catch(err => console.log(err))
    })

    // Function to handle the press event on a personal folder
    // It navigates to the 'Goal' screen with the selected folder as a parameter
    function handlePersonalFolderPress(folder: FolderProps){
        personalScreenNavigation.navigate('Goal', { folder });
    }

    // Function to handle the press event on a community folder
    // It navigates to the 'Goal' screen with the selected folder as a parameter
    function handleCommunityFolderPress(folder: FirestoreCommunityFolderProps){
        personalScreenNavigation.navigate('Goal', { folder });
    }

    // Function to handle the activation or deactivation of a folder
    // If the folder is active, it deactivates it, otherwise it activates it
    function handleActiveFolder(folderId?: string, isActive?: boolean) {
        if (!folderId || !userId) return;
    
        isActive ? deActivateFolder(userId, folderId) : activateFolder(userId, folderId, activeFolder);
    }

    // Function to handle the liking or unliking of a collection
    // If the collection is liked, it unlikes it, otherwise it likes it
    function handleLikeCollection(folderId?: string, liked?: boolean) {
        if (!folderId || !userId) return;

        liked ? unLikeFolder(folderId, userId) : likeFolder(folderId, userId);
    }


    return (
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom + bottomTabHeight,
                }}
                className='bg-primary px-4 flex-grow'
            >

                <View className='mt-4 flex-grow h-96'>
                    {/* header */}
                    <View>
                    <SearchBar
                        variant='filled'
                        placeholder="Search Personal, Community, Users"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery} />

                        {/* Filter Sections */}
                        <View className='flex-row justify-between mt-4'>
                            <View className='flex-row justify-between items-center'>
                                <FilterTag text='Personal' active={activeFilter === 'personal'} handleActiveChanged={() => setActiveFilter('personal')} />
                                <FilterTag text='Community' active={activeFilter === 'community'} handleActiveChanged={() => setActiveFilter('community')} />
                                <FilterTag text='Users' active={activeFilter === 'users'} handleActiveChanged={() => setActiveFilter('users')} />
                            </View>
                        </View>

                    </View>

                    {/* Search Results */}
                    <View className='mt-8 flex-grow h-full'>
                        {
                            allFolders.length > 0 ? 
                            <FlatList
                            data={filteredFolders}
                            keyExtractor={(item) => item.id?.toString() || item.uid?.toString()}
                            ListFooterComponent={() =>  <View className="h-40" />}
                            contentContainerStyle={styles.container}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                              <View className="p-2">
                                {/* Use the appropriate component for different modes of element */}
                                {
                                    item.mode === 'personal' &&
                                <Goal
                                fullWidth
                                  selectedFolder={item}
                                  active={item.id === activeFolder?.folderId}
                                  onPress={handlePersonalFolderPress}
                                />
                                }

                                {
                                    item.mode === 'community' &&
                                    <CommunityGoal 
                                    folder={item as CustomCommunityFolderProps} 
                                    active={activeFolder !== null && activeFolder?.folderId === item.id} 
                                    liked={userId && item.likes ? [...item.likes].includes(userId) : false} 
                                    onPress={handleCommunityFolderPress} 
                                    handleLike={handleLikeCollection} 
                                    handleActiveFolder={handleActiveFolder} />
                                }
                                {
                                    item.uid && 
                                    <View className='flex-row space-x-3 items-center bg-primary-300  p-5 rounded-md'>
                                    <UserAvatar username={item.username} imageUrl={item.image.secure_url} />
                                    <Text className='text-base'>{item.username}</Text>
                                    </View>
                                }
                              </View>
                            )}
                          />
                            :
                            <View>
                                <Text>no folders where found</Text>
                            </View>
                        }

                    </View>
                </View>


            </View>


    )
}

export default GlobalSearchScreen;


const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      marginBottom: 100,
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    item: {
      marginBottom: 10,
    },
  });
