import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useMemo, useRef } from 'react'
import SearchBar from '../common/SearchBar'
import { AntDesign } from '@expo/vector-icons';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SortItem from '../common/SortItem';
import { sortOptions } from '../../../settings';

interface Props {
    handleSearchQueryChanged: (query: string) => void
    searchQuery: string
    handleSearchSubmit: () => void
    handleSortPress: (id: string) => void

}


const ActionSection = ({ searchQuery, handleSearchQueryChanged, handleSearchSubmit, handleSortPress: _handleSortPress }: Props) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['25%', '25%'], []);


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

            <View className='mt-8'>
                <Text className='font-bold text-[11px] text-gray-200 uppercase mb-1.5'>Sort</Text>
                <TouchableOpacity className='flex-row items-center space-x-2 ' onPress={handleOpenPress}>
                    <Text className='text-lg text-secondary'>By Date</Text>
                    <AntDesign name="caretdown" size={12} color="white" />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet Modal To Display Sort Options */}
            <CustomBottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints} index={0} >
                <View className="flex-1 justify-start items-start bg-primary-300 px-4">
                    <Text className='font-bold text-[13px] text-gray-400 uppercase mb-4'>Sort Goals/Tasks By</Text>
                    <FlatList
                        data={sortOptions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <SortItem
                                title={item.title}
                                id={item.id}
                                current_id={'date_desc'}
                                onPress={handleSortPress}
                            />
                        )}
                    />
                </View>
            </CustomBottomSheetModal>
        </>
    )
}

export default ActionSection