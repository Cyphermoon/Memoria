import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ActionSection from '../../../components/Home/ActionSection'
import Goal from '../../../components/Home/Goal'
import GoalActionItem from '../../../components/Home/GoalActionItem'
import NewGoal from '../../../components/Home/NewGoal'
import { SelectedGoalProps } from '../../../components/Home/type'
import Container from '../../../components/common/Container'
import CustomBottomSheetModal from '../../../components/common/CustomBottomSheetModal'
import Logo from '../../../components/common/Logo'
import Text from '../../../components/common/Text'
import UserAvatar from '../../../components/common/UserAvatar'
import { getGreetings } from '../../../util'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../../../type'

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

type Props = NativeStackScreenProps<HomeStackParamList, "HomeScreen">


const HomeScreen = ({ navigation }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);
    const [selectedGoal, setSelectedGoal] = useState<SelectedGoalProps | null>(null)


    function handleOpenPress() {
        bottomSheetModalRef.current?.present()
    }


    function handleClosePress() {
        bottomSheetModalRef.current?.dismiss()
    }

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
        navigation.navigate('Goal', goal)
    }


    return (
        <SafeAreaView className='flex-grow bg-primary'>
            <Container>
                <View className='flex-row justify-between items-center mb-8'>
                    <Logo withName size='sm' />
                    <UserAvatar username='Cypher_Moon' />
                </View>

                <Text className='font-semibold text-4xl text-secondary mb-8'>
                    {getGreetings()}, Cypher
                </Text>

                <ActionSection
                    searchQuery={searchQuery}
                    handleSearchQueryChanged={handleSearchQueryChanged}
                    handleSearchSubmit={handleSearchSubmit}
                    handleSortPress={handleSortPress}
                />

                <View className='mt-8 flex-grow h-[500]'>
                    <FlatList
                        data={goals}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.container}
                        columnWrapperStyle={styles.columnWrapper}
                        numColumns={2}
                        ListFooterComponent={() => <View className='h-20' />}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Goal
                                    id={item.id.toString()}
                                    onPress={handleGoalPress}
                                    onMoreDetailsPress={handleMoreDetailsPress}
                                    text={item.text}
                                    active={item.active}
                                    items={item.items}
                                />
                            </View>
                        )}
                    />
                </View>

                <NewGoal />
            </Container>

            {/* Goal Bottom Sheet */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Goal Actions' >
                {selectedGoal &&

                    <View>
                        <GoalActionItem onPress={handleGoalEdit} icon='edit' text='Edit' id={selectedGoal.id} />
                        <GoalActionItem onPress={handleGoalDelete} icon='delete' text='Delete' id={selectedGoal.id} danger />
                    </View>
                }
            </CustomBottomSheetModal>
        </SafeAreaView>
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
