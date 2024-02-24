import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SortActions from '../../../components/Home/SortActions'
import { SortOptionProp } from '../../../components/Home/type'
import Text from '../../../components/common/Text'
import UserAvatar from '../../../components/common/UserAvatar'
import { FontAwesome6 } from '@expo/vector-icons';
import colors from 'colors'

interface Props {
    navigationTitle: string,
    handleSortPress: (option: SortOptionProp) => void
    currentOption?: SortOptionProp
    extendedSortOptions?: SortOptionProp[]
    children: React.ReactNode
    openDrawer: () => void
}


const HomeDrawerLayout = ({ navigationTitle, openDrawer, handleSortPress, currentOption, extendedSortOptions, children }: Props) => {
    const insets = useSafeAreaInsets()

    return (
        <View
            className='flex-grow bg-primary px-3'
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }}>

            <View className='flex-row justify-between items-center mb-4 mt-3'>
                <TouchableOpacity onPress={() => openDrawer()} className='rotate-180'>
                    <FontAwesome6 name="bars-staggered" size={26} color={colors.secondary} />
                </TouchableOpacity>
                <UserAvatar username='Cypher_Moon' />
            </View>

            <Text className='font-semibold text-4xl text-secondary mb-4'>
                {navigationTitle}
            </Text>

            <SortActions
                handleSortPress={handleSortPress}
                currentOption={currentOption}
                extendSortOptions={extendedSortOptions} />

            {children}

        </View>
    )
}

export default HomeDrawerLayout
