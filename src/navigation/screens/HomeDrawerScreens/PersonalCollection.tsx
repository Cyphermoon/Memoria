import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { sortOptions } from 'settings';
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer';
import { HomeStackParamList } from 'type';
import { FolderProps, SortOptionProp } from '../../../components/Home/type';

import Goal from '@components/Home/Goal';
import GoalActionItem from '@components/Home/GoalActionItem';
import NewGoal from '@components/Home/NewGoal';
import CustomBottomSheetModal from '@components/common/CustomBottomSheetModal';
import Text from '@components/common/Text';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from 'firebaseConfig';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useActiveFolder } from 'src/util/HomeDrawer/index.hook';
import { deleteFolder } from 'src/util/HomeDrawer/index.utll';
import { handleAndroidWallpaperActive } from 'src/util/changeWallpaperBackgroundTask/index.util';
import { useAuthStore } from 'store/authStore';
import HeaderContent, { Header } from './HomeDrawerLayout';

// Screen Types
type HomeScreenNavigationProp = NavigationProp<
  HomeStackParamList,
  'HomeDrawer'
>;
type Props = DrawerScreenProps<HomeDrawerParamList, 'Personal'>;



//constants

const HomeScreen = ({ navigation: drawerNavigation }: Props) => {
  const userId = useAuthStore((state) => state.user?.uid);
  const [folders, setFolders] = useState<FolderProps[] | null>(null);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['10%', '25%'], []);

  const [selectedFolder, setSelectedFolder] = useState<FolderProps | null>(
    null
  );
  const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(
    sortOptions[0]
  );

  const scrollY = useSharedValue(0);
  const activeFolder = useActiveFolder(userId);

  const scrollHandler = useAnimatedScrollHandler({
    // update scrollY value as user scrolls
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    if (!userId) return;
    // folder references
    const folderRef = collection(firestoreDB, 'users', userId, 'folders');

    // attach a listener to update ui when any change occurs
    const unsubscribe = onSnapshot(folderRef, (querySnapshot) => {
      const _folders: FolderProps[] = [];

      querySnapshot.forEach((doc) => {
        _folders.push({ id: doc.id, ...doc.data() } as FolderProps);
      });

      setFolders(_folders);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    // sort the folders based on the current sort option

    setFolders((prevFolders) => {
      return prevFolders
        ? [...prevFolders].sort((a, b) => {
          switch (currentSortOption.id) {
            case 'name_desc':
              // Sort by name
              return b.name.localeCompare(a.name);
            case 'date_desc':
              // Sort by date
              if (a.dateCreated && b.dateCreated) {
                return (
                  b.dateCreated.toDate().getTime() -
                  a.dateCreated.toDate().getTime()
                );
              } else {
                return 0;
              }
            case 'size_desc':
              // Sort by size
              return b.items - a.items;
            default:
              // If no sort option is selected, don't change the order
              return 0;
          }
        })
        : null;
    });
  }, [currentSortOption]); // Re-run this effect whenever the sort option changes

  function handleOpenPress() {
    bottomSheetModalRef.current?.present();
  }

  function handleClosePress() {
    bottomSheetModalRef.current?.dismiss();
  }

  function handleSortPress(option: SortOptionProp) {
    setCurrentSortOption(option);
  }

  function handleMoreDetailsPress(goal: FolderProps) {
    setSelectedFolder(goal);
    handleOpenPress();
  }

  async function handleGoalDelete() {
    userId && selectedFolder?.id && deleteFolder(userId, selectedFolder?.id);
    handleClosePress();
  }

  function handleGoalEdit() {
    if (!selectedFolder) return;
    navigation.navigate('AddCollection', {
      mode: 'personal',
      folder: {
        ...selectedFolder,
        active: activeFolder?.folderId === selectedFolder?.id,
        activeFolderItemIdx: selectedFolder?.activeFolderItemIdx,
      },
    });
    handleClosePress();
  }

  async function handleLongPress(folder: FolderProps) {
    // Set the user's wallpaper to the current folder Item
    if (Platform.OS === 'android') {
      handleAndroidWallpaperActive(activeFolder?.folderId === folder?.id, folder.id)
    } else {
      console.log("Shortcut loading on IOS On Personal Collection........")
    }
  }

  function handleGoalPress(goal: FolderProps, active: boolean) {
    navigation.navigate('Goal', { folder: goal, isActive: active });
  }

  function navigateToAddCollection() {
    navigation.navigate('AddCollection', { mode: "personal" })
  }

  return (
    <View className="flex-grow bg-primary relative">
      <Header
        navigationTitle="Personal Collection"
        scrollY={scrollY}
        openDrawer={() => drawerNavigation.openDrawer()}
      />

      {folders && folders?.length > 0 ? (
        <Animated.FlatList
          data={folders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          ListFooterComponent={() => <View className="h-20" />}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListHeaderComponent={() => (
            <HeaderContent
              navigationTitle="Personal Collection"
              handleSortPress={handleSortPress}
              currentSortOption={currentSortOption}
            />
          )}
          renderItem={({ item }) => {
            return (
              <View className="w-1/2 p-2">
                <Goal
                  selectedFolder={item}
                  active={activeFolder ? item.id === activeFolder.folderId : false}
                  onPress={handleGoalPress}
                  onMoreDetailsPress={handleMoreDetailsPress}
                  onLongPress={handleLongPress}
                />
              </View>
            );
          }}
        />
      ) : (
        <View>
          <Text>Your personal collection empty</Text>
        </View>
      )}

      <NewGoal onPress={navigateToAddCollection} />

      {/* Goal Bottom Sheet */}
      <CustomBottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={1}
        text="Goal Actions"
      >
        {selectedFolder && (
          <View>
            <GoalActionItem
              onPress={handleGoalEdit}
              icon="edit"
              label="Edit"
            // selectedFolder={selectedFolder}
            />

            <GoalActionItem
              onPress={handleGoalDelete}
              icon="delete"
              label="Delete"
              // selectedFolder={selectedFolder}
              danger
            />
          </View>
        )}
      </CustomBottomSheetModal>
    </View>
  );
};

export default HomeScreen;

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
