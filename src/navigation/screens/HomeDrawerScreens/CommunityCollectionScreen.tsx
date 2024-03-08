import CommunityGoal from '@components/Home/CommunityGoal'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import customColors from 'colors'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { sortOptions } from 'settings'
import { HomeStackParamList } from 'type'
import GoalActionItem from '../../../components/Home/GoalActionItem'
import NewGoal from '../../../components/Home/NewGoal'
import { CommunitySelectedGoal, SelectedGoalProps, SortOptionProp } from '../../../components/Home/type'
import CustomBottomSheetModal from '../../../components/common/CustomBottomSheetModal'
import HomeDrawerLayout, { HEADER_HEIGHT, Header } from './HomeDrawerLayout'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import HeaderContent from './HomeDrawerLayout'

const _goals = [
    { id: 1, text: 'Goal 1', active: true, items: 5, liked: true },
    { id: 2, text: 'Goal 2', active: false, items: 3, liked: false },
    { id: 3, text: 'Goal 3', active: false, items: 7, liked: true },
    { id: 4, text: 'Goal 4', active: false, items: 9, liked: false },
    { id: 5, text: 'Goal 5', active: false, items: 1, liked: true },
    { id: 6, text: 'Goal 6', active: false, items: 3, liked: false },
    { id: 7, text: 'Goal 7', active: false, items: 4, liked: true },
    { id: 8, text: 'Goal 8', active: false, items: 1, liked: false },
    { id: 9, text: 'Goal 9', active: false, items: 5, liked: true },
    { id: 10, text: 'Goal 10', active: false, items: 2, liked: false },
    { id: 11, text: 'Goal 11', active: false, items: 7, liked: true },
    { id: 12, text: 'Goal 12', active: false, items: 8, liked: false },
    { id: 13, text: 'Goal 13', active: false, items: 1, liked: true },
    { id: 14, text: 'Goal 14', active: false, items: 3, liked: false },
    { id: 15, text: 'Goal 15', active: false, items: 9, liked: true },
    { id: 16, text: 'Goal 16', active: false, items: 1, liked: false },
    { id: 17, text: 'Goal 17', active: false, items: 2, liked: true },
    { id: 18, text: 'Goal 18', active: false, items: 3, liked: false },
];

type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, "HomeDrawer">
type Props = DrawerScreenProps<HomeDrawerParamList, "Community">


const CommunityCollectionScreen = ({ navigation: drawerNavigation }: Props) => {
    const navigation = useNavigation<HomeScreenNavigationProp>()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);
    const [selectedGoal, setSelectedGoal] = useState<CommunitySelectedGoal | null>(null)
    const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0])
    const [goals, setGoals] = useState(_goals);

    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    function handleOpenPress() {
        bottomSheetModalRef.current?.present()
    }


    function handleClosePress() {
        bottomSheetModalRef.current?.dismiss()
    }

    function handleSortPress(option: SortOptionProp) {
        setCurrentSortOption(option)
    }

    function handleMoreDetailsPress(goal: CommunitySelectedGoal) {
        setSelectedGoal(goal)
        handleOpenPress()
    }

    function handleUseCollection(id: string) {
        console.log("Delete Goal: ", id)
    }

    function handleLikeCollection(id: string) {
        setGoals(prevGoals => prevGoals.map(goal => {
            if (goal.id.toString() === id) {
                return { ...goal, liked: !goal.liked };
            } else {
                return goal;
            }
        }));
        handleClosePress()
    }

    function handleGoalPress(goal: SelectedGoalProps) {
        navigation.navigate("Goal", goal)
    }


    return (
        <View className='flex-grow bg-primary relative'>

            <Header
                navigationTitle='Community Collection'
                scrollY={scrollY}
                openDrawer={() => drawerNavigation.openDrawer()}
            />

            <Animated.FlatList
                data={goals}
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
                            id={item.id.toString()}
                            onPress={handleGoalPress}
                            onMoreDetailsPress={handleMoreDetailsPress}
                            text={item.text}
                            active={item.active}
                            items={item.items}
                            liked={item.liked}
                            handleLike={handleLikeCollection}
                        />
                    </View>
                )}
            />

            <NewGoal mode="community" />

            {/* Goal Bottom Sheet */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Goal Actions' >
                {selectedGoal &&

                    <View>
                        <GoalActionItem
                            onPress={handleLikeCollection}
                            icon={(color, size) =>
                                <MaterialIcons
                                    name="favorite"
                                    size={size}
                                    color={selectedGoal.liked ? customColors.accent : color} />}
                            text={selectedGoal.liked ? 'Unlike Collection' : 'Like Collection'}
                            id={selectedGoal.id} />

                        <GoalActionItem
                            onPress={(handleUseCollection)}
                            icon={(color, size) => <Fontisto name="radio-btn-active" size={size} color={color} />}
                            text='Use Collection'
                            id={selectedGoal.id} />
                    </View>
                }
            </CustomBottomSheetModal>
        </View>
    )
}

export default CommunityCollectionScreen
