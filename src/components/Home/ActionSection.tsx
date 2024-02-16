import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useMemo, useRef } from 'react'
import SearchBar from '../common/SearchBar'
import { AntDesign } from '@expo/vector-icons';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SortItem from '../common/SortItem';
import { sortOptions } from '../../../settings';
import colors from '../../../colors';

interface Props {
    handleSearchQueryChanged: (query: string) => void
    searchQuery: string
    handleSearchSubmit: () => void
    handleSortPress: (id: string) => void

}


const ActionSection = ({ searchQuery, handleSearchQueryChanged, handleSearchSubmit, handleSortPress: _handleSortPress }: Props) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);

    const handleOpenPress = () => bottomSheetModalRef.current?.present();
    const handleClosePress = () => bottomSheetModalRef.current?.dismiss();

    function handleSortPress(id: string) {
        _handleSortPress(id)
        handleClosePress()
    }

    return (
        <>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={handleSearchQueryChanged}
                handleSearchSubmit={handleSearchSubmit} />

            <View className='mt-6'>
                <Text className='font-bold text-[11px] text-gray-200 uppercase mb-1.5'>Sort</Text>
                <TouchableOpacity className='flex-row items-center justify-start space-x-2 w-[100]' onPress={handleOpenPress}>
                    <Text className='text-lg text-secondary'>By Name</Text>
                    <AntDesign name="caretdown" size={12} color={colors.secondary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet Modal To Display Sort Options */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={1} text='Sort Goals/Tasks By' >
                <FlatList
                    data={sortOptions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SortItem
                            title={item.title}
                            id={item.id}
                            current_id={'name_desc'}
                            onPress={handleSortPress}
                        />
                    )}
                />

            </CustomBottomSheetModal>
        </>
    )
}

export default ActionSection