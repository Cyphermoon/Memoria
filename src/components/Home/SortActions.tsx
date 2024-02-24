import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../../colors';
import { sortOptions as defaultSortOptions } from '../../../settings';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import SortItem from '../common/SortItem';
import { SortOptionProp } from './type';

interface Props {
    handleSortPress: (option: SortOptionProp) => void
    extendSortOptions?: SortOptionProp[]
    currentOption?: SortOptionProp
}


const SortActions = ({ handleSortPress: _handleSortPress, extendSortOptions, currentOption: _currentOption }: Props) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '25%'], []);

    const sortOptions = extendSortOptions ? [...defaultSortOptions, ...extendSortOptions] : defaultSortOptions
    const currentOption = _currentOption || sortOptions[0]

    const handleOpenPress = () => bottomSheetModalRef.current?.present();
    const handleClosePress = () => bottomSheetModalRef.current?.dismiss();

    function handleSortPress(option: SortOptionProp) {
        _handleSortPress(option)
        handleClosePress()
    }

    return (
        <>

            <View className=''>
                <Text className='font-bold text-[11px] text-gray-200 uppercase mb-0.5'>Sort</Text>
                <TouchableOpacity className='flex-row items-center justify-start space-x-2 w-[100]' onPress={handleOpenPress}>
                    <Text className='text-lg text-secondary'>{currentOption.title}</Text>
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
                            current_id={currentOption.id}
                            onPress={handleSortPress}
                        />
                    )}
                />

            </CustomBottomSheetModal>
        </>
    )
}

export default SortActions