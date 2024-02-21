import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from 'colors';
import React from 'react';
import { HomeStackParamList } from 'type';
import HomeStackNavigator from '../HomeStackNavigator';
import ProfileStackNavigator from '../ProfileStackNavigator';


type MainBottomTabNavigatorParamList = {
    Home: BottomTabScreenProps<HomeStackParamList>
    Profile: undefined;
}

// Import your screen components here

const Tab = createBottomTabNavigator<MainBottomTabNavigatorParamList>();

const MainBottomTabNavigator = () => {

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: 'home' | 'home-outline' | 'person' | 'person-outline' = 'home-outline';

                if (route.name === 'Home') {
                    iconName = focused
                        ? 'home'
                        : 'home-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: colors.primary[300],
                borderTopWidth: 0,
            },
            headerShown: false,
        })}>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
};

export default MainBottomTabNavigator;
