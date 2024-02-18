import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import colors from '../../../colors'
import Text from '../common/Text';
import CustomBottomSheetModal from '../common/CustomBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import IntervalOption from './IntervalOption';
import Touchable from '@components/common/Touchable';
import { IntervalOptionProps } from './type';
import { intervalOptions } from 'settings';



interface Props {
    selectedInterval: IntervalOptionProps | null;
    handleIntervalSelected: (interval: IntervalOptionProps) => void;
}

const IntervalSelector: React.FC<Props> = ({
    selectedInterval,
    handleIntervalSelected,
}) => {
    const [snapPoints, _] = useState(['10%', '25%'])
    const ref = useRef<BottomSheetModal>(null)

    function openModal() {
        ref.current?.present()
    }

    function closeModal() {
        ref.current?.dismiss()
    }

    function _handleIntervalSelected(interval: IntervalOptionProps) {
        handleIntervalSelected(interval)
        closeModal()
    }

    return (
        <View >
            <Touchable className='flex-row py-3.5' variant='outline' onPress={openModal}>
                <FontAwesome6 name={selectedInterval?.icon} size={16} color={colors.accent} />
                <Text className='text-accent ml-2'>
                    {selectedInterval?.label}
                </Text>

            </Touchable>

            <CustomBottomSheetModal ref={ref} snapPoints={snapPoints} index={1} text='Select Interval'>
                <View className='space-y-5'>
                    {intervalOptions.map((interval, index) => (
                        <IntervalOption
                            key={index}
                            label={interval.label}
                            value={interval.value}
                            icon={interval.icon}
                            active={selectedInterval?.value === interval.value}
                            handlePress={_handleIntervalSelected}
                        />
                    ))}
                </View>
            </CustomBottomSheetModal>
        </View>
    );
};

export default IntervalSelector;