import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { publishModes } from '../../../settings';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import Text from '../common/Text';
import { SelectedCollectionModeProps } from './type';

interface Props {
    selectedMode: SelectedCollectionModeProps | null;
    handleImageSelected: (mode: SelectedCollectionModeProps) => void;
}

const PublishCollectionModeSelector: React.FC<Props> = ({
    selectedMode,
    handleImageSelected: _handleImageSelected,
}) => {
    const ref = useRef<BottomSheetModal>(null);
    const [snapPoints] = useState(['10%', '25%']);

    const openModal = () => {
        ref.current?.present();
    };

    const closeModal = () => {
        ref.current?.dismiss();
    };

    const handleImageSelected = (mode: SelectedCollectionModeProps) => {
        _handleImageSelected(mode);
        closeModal();
    };

    return (
        <View className='space-y-3 mb-8'>
            <Text className="font-medium">Select where to publish</Text>

            <TouchableOpacity
                className='flex-row items-center justify-between first-letter:w-full bg-primary-300  rounded-lg p-4'
                onPress={openModal}>
                <Text className='text-gray-300'>{selectedMode?.label}</Text>
                <AntDesign name="down" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <CustomBottomSheetModal ref={ref} snapPoints={snapPoints} index={1} text='Select Where to publish collection'>
                <View className='space-y-5 z-[999]'>
                    {publishModes.map((mode) => (
                        <TouchableOpacity
                            key={mode.value}
                            className='md-8'
                            onPress={() => handleImageSelected(mode as SelectedCollectionModeProps)}>
                            <Text className='text-sm'>{mode.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </CustomBottomSheetModal>
        </View>
    );
};

export default PublishCollectionModeSelector;