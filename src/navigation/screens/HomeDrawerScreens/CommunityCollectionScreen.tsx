import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { sortOptions } from 'settings'
import { HomeStackParamList } from 'type'
import Goal from '../../../components/Home/Goal'
import GoalActionItem from '../../../components/Home/GoalActionItem'
import NewGoal from '../../../components/Home/NewGoal'
import { CommunitySelectedGoal, SelectedGoalProps, SortOptionProp } from '../../../components/Home/type'
import CustomBottomSheetModal from '../../../components/common/CustomBottomSheetModal'
import HomeDrawerLayout from './HomeDrawerLayout'
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'
import customColors from 'colors';
import CommunityGoal from '@components/Home/CommunityGoal'

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


const CommunityCollectionScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);
    const [selectedGoal, setSelectedGoal] = useState<CommunitySelectedGoal | null>(null)
    const [currentSortOption, setCurrentSortOption] = useState<SortOptionProp>(sortOptions[0])
    const [goals, setGoals] = useState(_goals);

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
        <HomeDrawerLayout navigationTitle='Community Collection' handleSortPress={handleSortPress} currentOption={currentSortOption}>

            <View className='mt-8 flex-grow h-[600]'>
                <FlatList
                    data={goals}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.container}
                    numColumns={1}
                    ListFooterComponent={() => <View className='h-20' />}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
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
                <NewGoal mode='community' />
            </View>


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
        </HomeDrawerLayout>
    )
}

export default CommunityCollectionScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginBottom: 100
    },

    item: {
        marginBottom: 25,
    },
});
