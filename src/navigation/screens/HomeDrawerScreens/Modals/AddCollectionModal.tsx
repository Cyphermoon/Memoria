import PublishCollectionModeSelector from '@components/Home/PublishCollectionModeSelector';
import { FirestoreCommunityFolderProps, FolderPropsWithActive, SelectedCollectionModeProps } from '@components/Home/type';
import { FontAwesome } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { editCommunityFolder, editFolder, uploadCommunityFolder, uploadFolder } from 'src/util/HomeDrawer/index.utll';
import { useAuthStore } from 'store/authStore';
import colors from 'tailwindcss/colors';
import customColors from '../../../../../colors';
import { HomeStackParamList } from '../../../../../type';
import Text from '../../../../components/common/Text';
import Touchable from '../../../../components/common/Touchable';
import { DEFAULT_ACTIVE_FOLDER_ITEM_IDX } from 'settings';
import { configureAndScheduleBackgroundFetch, setWallpaperFromActiveFolder } from 'src/util/changeWallpaperBackgroundTask/index.util';
import { updateFolderAndActiveFolder, updateUserActiveFolderItemIdx } from 'src/util/changeWallpaperBackgroundTask/firestore.util';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddCollection'>;

/*
This component is used to both add and edit a collection. Although it's original intention was to add collection
*/

const AddCollectionModal = ({ navigation, route }: Props) => {
	const [folderName, setFolderName] = useState('');
	const [selectedMode, setSelectedMode] = useState<SelectedCollectionModeProps>(
		{ label: 'Personal', value: 'personal' }
	);
	const [isActive, setIsActive] = useState(false);

	const isEditingMode = route.params.folder ? true : false;

	const insets = useSafeAreaInsets();
	const bottomTabBarHeight = useBottomTabBarHeight();
	const userId = useAuthStore((state) => state.user?.uid);
	const userName = useAuthStore((state) => state.user?.username);
	//    const userImage = useAuthStore(state => state.user?.i)

	function toggleSwitch() {
		setIsActive((active) => !active);
	}

	async function addPersonalCollection(userId: string) {
		// create/edit the user personal folder in firestore
		if (!route.params.folder) {
			await uploadFolder(
				userId,
				{
					mode: selectedMode.value,
					interval: 'daily',
					name: folderName,
					dateCreated: serverTimestamp(),
					activeFolderItemIdx: DEFAULT_ACTIVE_FOLDER_ITEM_IDX,
				},
				isActive
			);
		} else {
			await editFolder(
				userId,
				route.params.folder.id,
				{
					mode: selectedMode.value,
					name: folderName,
					activeFolderItemIdx: (route.params?.folder as FolderPropsWithActive)
						?.activeFolderItemIdx,
				},
				isActive
			);

			// Set the user wallpaper to the active item image if it is active
		}

		if (Platform.OS === 'android' && isActive) {
			// configureAndScheduleBackgroundFetch('daily');
			await setWallpaperFromActiveFolder();
			route.params.folder?.id && await updateFolderAndActiveFolder(1, route.params.folder.id);
		}

	}

	async function addCommunityCollection(userId: string) {
		// Create a new community folder if no existing folder is provided
		if (!route.params.folder && userName) {
			await uploadCommunityFolder({
				mode: selectedMode.value,
				name: folderName,
				dateCreated: serverTimestamp(),
				likes: 0,
				interval: 'daily',
				items: 0,
				user: {
					name: userName,
					id: userId,
				},
			});
		}
		// Edit the existing community folder if a folder is provided
		else if (route.params.folder) {
			const folder = route.params.folder as FirestoreCommunityFolderProps;
			const { id, ...rest } = folder;

			const data = {
				id,
				name: folderName,
				mode: selectedMode.value,
				dateCreated: rest.dateCreated,
				items: rest.items,
				user: rest.user,
				likes: rest.likes,
			};
			await editCommunityFolder(id, data, isActive);
		}

		// update user wallpaper if the folder is active
		if (Platform.OS === 'android' && isActive) {
			// configureAndScheduleBackgroundFetch('daily');
			await setWallpaperFromActiveFolder();
			route.params.folder?.id && await updateUserActiveFolderItemIdx(userId, 1);
		}
	}

	function handleCollection() {
		if (!userId) return;
		setFolderName('');

		// specific actions for mode of operation
		if (route.params.mode === 'personal') addPersonalCollection(userId);
		else if (route.params.mode === 'community') addCommunityCollection(userId);

		navigation.canGoBack() && navigation.goBack();
	}

	useEffect(() => {
		// stop prefill mode field if editing
		if (isEditingMode) return;

		const mode = route.params.mode;
		if (!mode) return;
		if (mode === 'personal')
			setSelectedMode({ label: 'Personal', value: 'personal' });
		else if (mode === 'community')
			setSelectedMode({ label: 'Community', value: 'community' });
	}, []);

	useEffect(() => {
		// prefill fields if editing

		if (route.params.folder) {
			setFolderName(route.params.folder.name);

			setIsActive(route.params.folder.active);

			// set mode to the param value
			if (route.params.folder.mode === 'personal') {
				setSelectedMode({ label: 'Personal', value: 'personal' });
			} else if (route.params.folder.mode === 'community') {
				setSelectedMode({ label: 'Community', value: 'community' });
			}
		}
	}, []);

	return (
		<TouchableWithoutFeedback onPress={() => folderName && Keyboard.dismiss()}>
			<View
				className="flex-grow bg-primary"
				style={{
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
				}}
			>
				<View className="p-4 justify-between flex-grow">
					<View>
						<View className="flex-row items-center justify-between mb-14">
							<Text className="text-center font-medium flex-grow text-2xl  text-gray-300">
								{isEditingMode ? 'Edit' : 'New'} Collection
							</Text>

							<TouchableOpacity onPress={() => navigation.goBack()}>
								<FontAwesome
									name="times"
									size={29}
									color={customColors.secondary}
								/>
							</TouchableOpacity>
						</View>

						<View className="mb-14">
							<Text className="mb-2">Name</Text>
							<TextInput
								value={folderName}
								onChangeText={setFolderName}
								placeholder="Enter your folder name"
								placeholderTextColor={colors.gray[500]}
								className="w-full bg-primary-300 px-2 py-4 text-secondary rounded-md"
							/>
						</View>

						<PublishCollectionModeSelector
							selectedMode={selectedMode}
							handleImageSelected={setSelectedMode}
						/>

						<View className="flex-col justify-center space-y-2">
							<Text>Active</Text>

							<Switch
								trackColor={{
									false: customColors.primary['300'],
									true: '#FFAEDC',
								}}
								thumbColor={
									isActive ? customColors.primary.DEFAULT : colors.gray[300]
								}
								ios_backgroundColor={customColors.primary['300']}
								value={isActive}
								onValueChange={toggleSwitch}
							/>
						</View>
					</View>

					<Touchable
						isText
						style={{ marginBottom: bottomTabBarHeight }}
						onPress={handleCollection}
						disabled={folderName === ''}
					>
						{isEditingMode ? 'Edit' : 'Add'} Collection
					</Touchable>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default AddCollectionModal;
