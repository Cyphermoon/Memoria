import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SelectImageGenerationMethodOption from './SelectImageGenerationMethodOption';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import colors from 'tailwindcss/colors';
import { ImageGenerationMethodOptionProps } from './type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { imageGenerationModes } from '../../modals/AddGoalItemModal';


interface ImageGenerationSelectorProps {
    selectedMode: ImageGenerationMethodOptionProps | null;

    handleImageSelected: (mode: ImageGenerationMethodOptionProps) => void;
}

const ImageGenerationSelector: React.FC<ImageGenerationSelectorProps> = ({
    selectedMode,
    handleImageSelected,
}) => {
    const [snapPoints, _] = useState(['10%', '25%'])
    const ref = useRef<BottomSheetModal>(null)

    function openModal() {
        ref.current?.present()
    }

    function closeModal() {
        ref.current?.dismiss()
    }

    function _handleImageSelected(mode: ImageGenerationMethodOptionProps) {

        handleImageSelected(mode)
        closeModal()
    }

    return (
        <View className='space-y-3'>
            <Text className="font-medium">Select image generation method</Text>

            <TouchableOpacity
                className='flex-row items-center justify-between first-letter:w-full bg-primary-300  rounded-lg p-4'
                onPress={openModal}>
                <Text className='text-gray-300'>{selectedMode?.label}</Text>
                <AntDesign name="down" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <CustomBottomSheetModal ref={ref} snapPoints={snapPoints} index={1} text='Select Image generation mode'>
                <View className='space-y-5'>
                    {imageGenerationModes.map((mode, index) => (
                        <SelectImageGenerationMethodOption
                            key={index}
                            label={mode.label}
                            value={mode.value}
                            icon={mode.icon}
                            active={selectedMode?.value === mode.value}
                            handlePress={_handleImageSelected}
                        />
                    ))}
                </View>
            </CustomBottomSheetModal>
        </View>
    );
};

export default ImageGenerationSelector;