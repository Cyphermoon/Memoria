import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@screens/ProfileScreen';

import React from 'react';


type ProfileStackParamList = {
    ProfileScreen: undefined
}

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='ProfileScreen' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
