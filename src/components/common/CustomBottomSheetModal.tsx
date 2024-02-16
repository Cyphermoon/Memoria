import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';
import { View } from 'react-native';
import Text from './Text';

interface Props extends BottomSheetModalProps {
    snapPoints: string[];
    children: React.ReactNode;
    text: string
}

const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(({ snapPoints, children, text, ...rest }, ref) => {
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={ref}
            {...rest}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: '#0F1728' }}
            handleIndicatorStyle={{ backgroundColor: '#D9D9D9', display: 'none' }}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
        >
            <View className="flex-1 justify-start items-start bg-primary-300 px-4">
                <Text className='font-bold text-[13px] text-gray-400 uppercase mb-4'>{text}</Text>
                {children}
            </View>

        </BottomSheetModal >
    );
});

export default CustomBottomSheetModal;