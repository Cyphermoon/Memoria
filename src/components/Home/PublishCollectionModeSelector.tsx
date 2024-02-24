import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import colors from 'tailwindcss/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { imageGenerationModes, publishModes } from '../../../settings';
import Text from '../common/Text';



interface SelectedCollectionModeProps {
    label: string
    value: string
}

interface Props {
    selectedMode: SelectedCollectionModeProps | null;

    handleImageSelected: (mode: SelectedCollectionModeProps) => void;
}

const PublishCollectionModeSelector: React.FC<Props> = ({
    selectedMode,
    handleImageSelected: _handleImageSelected,
}) => {
    const [snapPoints, _] = useState(['10%', '25%'])
    const ref = useRef<BottomSheetModal>(null)

    function openModal() {
        ref.current?.present()
    }

    function closeModal() {
        ref.current?.dismiss()
    }

    function handleImageSelected(mode: SelectedCollectionModeProps) {
        _handleImageSelected(mode)
        closeModal()
    }

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
                    {publishModes.map((mode, index) => (
                        <TouchableOpacity key={mode.value} className='md-8' onPress={(e) => handleImageSelected(mode)}>
                            <Text className='text-sm'>{mode.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </CustomBottomSheetModal>
        </View>
    );
};

export default PublishCollectionModeSelector;