import CommunityGoal from '@components/Home/CommunityGoal';
import Text from '@components/common/Text';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import customColors from 'colors';
import { DocumentData, Query, collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestoreDB } from 'firebaseConfig';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { DEFAULT_ACTIVE_FOLDER_ITEM_IDX, sortOptions } from 'settings';
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer';
import { HomeStackParamList } from 'type';
import GoalActionItem from '../../../components/Home/GoalActionItem';
import NewGoal from '../../../components/Home/NewGoal';
import { FirestoreCommunityFolderProps, CustomCommunityFolderProps, SortOptionProp } from '../../../components/Home/type';
import CustomBottomSheetModal from '../../../components/common/CustomBottomSheetModal';
import HeaderContent, { Header } from './HomeDrawerLayout';
import { useAuthStore } from 'store/authStore';
import { activateFolder, deActivateFolder, deleteCommunityFolder, handleSortChanged, likeFolder, unLikeFolder } from 'src/util/HomeDrawer/index.utll';
import { useActiveFolder } from 'src/util/HomeDrawer/index.hook';

type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, 'HomeDrawer'>;
type Props = DrawerScreenProps<HomeDrawerParamList, 'Community'>;

const CommunityCollectionScreen = ({ navigation: drawerNavigation }: Props) => {
	// application components state
	const navigation = useNavigation<HomeScreenNavigationProp>();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['10%', '30%'], []);

	// folder state
	const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0]);
	const [selectedFolder, setSelectedFolder] = useState<CustomCommunityFolderProps | undefined | null>(undefined);
	const [folders, setFolders] = useState<FirestoreCommunityFolderProps[] | null>(null);
	const [filterLiked, setFilterLiked] = useState(false);

	const userId = useAuthStore((state) => state.user?.uid);
	const activeFolder = useActiveFolder(userId);

	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		// updates the scrollY value whenever the user scrolls
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	useEffect(() => {
		// Get a reference to the user's document
		if (!userId) return;
		const userDocRef = doc(firestoreDB, 'users', userId);

		// Listen for real-time changes to the communitySort property
		const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				// Update currentSortOption with the new communitySort value
				const communitySort = docSnapshot.data()?.communitySort;
				if (communitySort) {
					setCurrentSortOption(communitySort);
				} else {
					handleSortChanged(sortOptions[0], userId);
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
			name_desc: 'name',
			date_desc: 'dateCreated',
			size_desc: 'items',
		};

		/// get community folder ref
		const folderRef = collection(firestoreDB, 'community');

		let q: Query<DocumentData>;

		if (filterLiked && userId) {
			q = query(folderRef, orderBy(firebaseValueMap[currentSortOption.id as keyof typeof firebaseValueMap], 'desc'), where('likes', 'array-contains', userId));
		} else {
			q = query(folderRef, orderBy(firebaseValueMap[currentSortOption.id as keyof typeof firebaseValueMap], 'desc'));
		}

		// watch for changes and update the folders state
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const folders: FirestoreCommunityFolderProps[] = [];

			querySnapshot.forEach((doc) => {
				folders.push({
					id: doc.id,
					...doc.data(),
				} as FirestoreCommunityFolderProps);
			});

			setFolders(folders);
		});

		// unsubscribe from the collection when component unmounts
		return () => {
			unsubscribe();
		};
	}, [currentSortOption, filterLiked, userId]);

	function handleOpenPress() {
		bottomSheetModalRef.current?.present();
	}

	function handleClosePress() {
		bottomSheetModalRef.current?.dismiss();
	}

	function handleSortPress(option: SortOptionProp) {
		handleSortChanged(option, userId);
	}

	function handleMoreDetailsPress(folder: CustomCommunityFolderProps) {
		setSelectedFolder(folder);
		handleOpenPress();
	}

	function handleActiveFolder(folderId?: string, isActive?: boolean) {
		const resFolderId = folderId || selectedFolder?.id;
		const resActive = isActive !== undefined ? isActive : selectedFolder?.active;

		if (!resFolderId) return;
		if (!userId) return;

		resActive ? deActivateFolder(userId, resFolderId) : activateFolder(userId, resFolderId,DEFAULT_ACTIVE_FOLDER_ITEM_IDX, activeFolder);
	}

	function handleLikeCollection(folderId?: string, liked?: boolean) {
		if (!userId) return;

		const resFolderId = folderId || selectedFolder?.id;
		const resLiked = liked !== undefined ? liked : selectedFolder?.liked;

		if (!resFolderId) return;

		resLiked ? unLikeFolder(resFolderId, userId) : likeFolder(resFolderId, userId);
		handleClosePress();
	}

	function handleGoalPress(goal: FirestoreCommunityFolderProps) {
		navigation.navigate('Goal', { folder: (goal as CustomCommunityFolderProps) });
	}

	function handleFolderEdit() {
		if (!selectedFolder) return;
		navigation.navigate('AddCollection', {
			mode: 'community',
			folder: selectedFolder,
		});
		handleClosePress();
	}

	function handleFolderDelete() {
		selectedFolder && deleteCommunityFolder(selectedFolder?.id);
		handleClosePress();
	}

	return (
		<View className="flex-grow bg-primary relative">
			<Header navigationTitle="Community Collection" scrollY={scrollY} openDrawer={() => drawerNavigation.openDrawer()} />

			{folders && currentSortOption !== undefined ? (
				<Animated.FlatList
					data={folders}
					keyExtractor={(item) => item.id.toString()}
					numColumns={1}
					ListFooterComponent={() => <View className="h-20" />}
					onScroll={scrollHandler}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={() => <HeaderContent navigationTitle="Community Collection" handleSortPress={handleSortPress} handleLikedFilter={setFilterLiked} filterLiked={filterLiked} currentSortOption={currentSortOption} marginBottom={36} />}
					renderItem={({ item }) => (
						<View className="px-3 mb-7">
							<CommunityGoal folder={item} active={activeFolder !== null && activeFolder?.folderId === item.id} liked={userId && item.likes ? [...item.likes].includes(userId) : false} onPress={handleGoalPress} onMoreDetailsPress={handleMoreDetailsPress} handleLike={handleLikeCollection} handleActiveFolder={handleActiveFolder} />
						</View>
					)}
				/>
			) : (
				<Text>There are no community folders</Text>
			)}

			<NewGoal mode="community" />

			{/* Goal Bottom Sheet */}
			<CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text="Community Folder Actions">
				{selectedFolder && (
					<View>
						<GoalActionItem 
							onPress={handleLikeCollection} 
							icon={(color, size) => <MaterialIcons name="favorite" size={size} color={customColors.accent} />} 
							label={selectedFolder.liked ? 'Unlike Collection' : 'Like Collection'}  />

						<GoalActionItem 
							onPress={handleActiveFolder} 
							icon={(color, size) => <Fontisto name="radio-btn-active" size={size} color={color} />} 
							label="Use Collection" 
						/>
							
						{selectedFolder?.user.id === userId && (
							<>
								<GoalActionItem onPress={handleFolderEdit} icon="edit" label="Edit"  />

								<GoalActionItem onPress={handleFolderDelete} icon="delete" label="Delete" danger />
							</>
						)}
					</View>
				)}
			</CustomBottomSheetModal>
		</View>
	);
};

export default CommunityCollectionScreen;
