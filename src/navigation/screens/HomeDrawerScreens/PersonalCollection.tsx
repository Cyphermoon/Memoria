import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { sortOptions } from 'settings'
import { HomeDrawerParamList } from 'src/navigation/HomeDrawer'
import { HomeStackParamList } from 'type'
import { SelectedGoalProps, SortOptionProp } from '../../../components/Home/type'

import Goal from '@components/Home/Goal'
import GoalActionItem from '@components/Home/GoalActionItem'
import NewGoal from '@components/Home/NewGoal'
import CustomBottomSheetModal from '@components/common/CustomBottomSheetModal'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import HeaderContent, { Header } from './HomeDrawerLayout'


// Screen Types
type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, "HomeDrawer">
type Props = DrawerScreenProps<HomeDrawerParamList, "Personal">

//constants

const HomeScreen = ({ navigation: drawerNavigation }: Props) => {
    const navigation = useNavigation<HomeScreenNavigationProp>()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);
    const [selectedGoal, setSelectedGoal] = useState<SelectedGoalProps | null>(null)
    const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0])

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

    function handleMoreDetailsPress(goal: SelectedGoalProps) {
        setSelectedGoal(goal)
        handleOpenPress()
    }

    function handleGoalDelete(id: string) {
        console.log("Delete Goal: ", id)
    }

    function handleGoalEdit(id: string) {
        console.log("Edit Goal: ", id)
    }


    function handleGoalPress(goal: SelectedGoalProps) {
        navigation.navigate("Goal", goal)
    }


    return (
        <View
            className='flex-grow bg-primary relative'>

            <Header
                navigationTitle='Personal Collection'
                scrollY={scrollY}
                openDrawer={() => drawerNavigation.openDrawer()}
            />

            <Animated.FlatList
                data={goals}
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
                            items={item.items}
                            id={item.id.toString()}
                            onPress={handleGoalPress}
                            onMoreDetailsPress={handleMoreDetailsPress}
                            text={item.text}
                            active={item.active}
                        />
                    </View>
                )}
            />

            <NewGoal mode='personal' />

            {/* Goal Bottom Sheet */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Goal Actions' >
                {selectedGoal &&

                    <View>
                        <GoalActionItem onPress={handleGoalEdit} icon='edit' text='Edit' id={selectedGoal.id} />
                        <GoalActionItem onPress={handleGoalDelete} icon='delete' text='Delete' id={selectedGoal.id} danger />
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



const goals = [
    { id: 1, text: 'Goal 1', active: true, items: 5 },
    { id: 2, text: 'Goal 2', active: false, items: 3 },
    { id: 3, text: 'Goal 3', active: false, items: 7 },
    { id: 4, text: 'Goal 4', active: false, items: 9 },
    { id: 5, text: 'Goal 5', active: false, items: 1 },
    { id: 6, text: 'Goal 6', active: false, items: 3 },
    { id: 7, text: 'Goal 7', active: false, items: 4 },
    { id: 8, text: 'Goal 8', active: false, items: 1 },
    { id: 9, text: 'Goal 9', active: false, items: 5 },
    { id: 10, text: 'Goal 10', active: false, items: 2 },
    { id: 11, text: 'Goal 11', active: false, items: 7 },
    { id: 12, text: 'Goal 12', active: false, items: 8 },
    { id: 13, text: 'Goal 13', active: false, items: 1 },
    { id: 14, text: 'Goal 14', active: false, items: 3 },
    { id: 15, text: 'Goal 15', active: false, items: 9 },
    { id: 16, text: 'Goal 16', active: false, items: 1 },
    { id: 17, text: 'Goal 17', active: false, items: 2 },
    { id: 18, text: 'Goal 18', active: false, items: 3 },
    // More goals...
];