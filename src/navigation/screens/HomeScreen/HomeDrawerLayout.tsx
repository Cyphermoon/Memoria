import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SortActions from '../../../components/Home/SortActions'
import { SortOptionProp } from '../../../components/Home/type'
import Container from '../../../components/common/Container'
import Logo from '../../../components/common/Logo'
import Text from '../../../components/common/Text'
import UserAvatar from '../../../components/common/UserAvatar'

interface Props {
    navigationTitle: string,
    handleSortPress: (option: SortOptionProp) => void
    currentOption?: SortOptionProp
    extendedSortOptions?: SortOptionProp[]
    children: React.ReactNode
}


const HomeDrawerLayout = ({ navigationTitle, handleSortPress, currentOption, extendedSortOptions, children }: Props) => {
    return (
        <SafeAreaView className='flex-grow bg-primary'>
            <Container>
                <View className='flex-row justify-between items-center mb-4'>
                    <Logo withName size='sm' />
                    <UserAvatar username='Cypher_Moon' />
                </View>

                <Text className='font-semibold text-4xl text-secondary mb-0'>
                    {navigationTitle}
                </Text>

                <SortActions
                    handleSortPress={handleSortPress}
                    currentOption={currentOption}
                    extendSortOptions={extendedSortOptions} />
                {children}
            </Container>
        </SafeAreaView>
    )
}

export default HomeDrawerLayout
