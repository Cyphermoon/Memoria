import Logo from '@components/common/Logo';
import Text from '@components/common/Text';
import UserAvatar from '@components/common/UserAvatar';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '@screens/HomeScreen';
import colors from 'colors';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define your screens here

type HomeDrawerParamList = {
    Personal: undefined;
}


const Drawer = createDrawerNavigator<HomeDrawerParamList>();

const HomeDrawer = () => {
    return (

        <Drawer.Navigator
            initialRouteName='Personal'
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: colors.primary[300]
                }
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />
            }>
            <Drawer.Screen name="Personal" component={HomeScreen} />
        </Drawer.Navigator>

    );
};

export default HomeDrawer;


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
        <DrawerContentScrollView {...props}>
            <View
                className='flex-row justify-between items-center px-4 mb-6 mt-4'>
                <Logo withName size='sm' />
            </View>
            <View>
                <Text className='text-gray-500 text-xs uppercase px-4'>Collection</Text>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    )
}
