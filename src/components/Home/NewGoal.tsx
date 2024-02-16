import { FontAwesome6 } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../../App';
import colors from '../../../colors';

type HomeScreenNavigationProps = NavigationProp<RootStackParamList, "Home">

const NewGoal = () => {

    const navigation = useNavigation<HomeScreenNavigationProps>()

    function navigateToAddCollection() {
        navigation.navigate('AddCollection')
    }

    return (
        <TouchableOpacity
            onPress={navigateToAddCollection}
            className='bg-accent w-16 h-16 rounded-full justify-center items-center shadow-sm shadow-secondary absolute right-4 bottom-10'>
            <FontAwesome6 name="add" size={30} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
    )
}

export default NewGoal