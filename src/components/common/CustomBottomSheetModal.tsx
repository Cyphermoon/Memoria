import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';

interface Props extends BottomSheetModalProps {
    snapPoints: string[];
    children: React.ReactNode;
}

const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(({ snapPoints, children, ...rest }, ref) => {
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
            backdropComponent={renderBackdrop}
        >
            {children}
        </BottomSheetModal >
    );
});

export default CustomBottomSheetModal;