import Logo from '@components/common/Logo';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '@screens/HomeDrawer/HomeScreen';
import colors from 'colors';
import React from 'react';
import { View } from 'react-native';
import tailwindColors from 'tailwindcss/colors';

// Define your screens here

export type HomeDrawerParamList = {
    Personal: undefined
    Community: undefined
    Categories: undefined
}


const Drawer = createDrawerNavigator<HomeDrawerParamList>();

const HomeDrawer = () => {
    return (

        <Drawer.Navigator
            initialRouteName='Personal'
            screenOptions={{
                headerShown: false,
                drawerStyle: { backgroundColor: colors.primary[300] },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />
            }>
            <Drawer.Screen name="Personal" component={HomeScreen} />
        </Drawer.Navigator>

    );
};

export default HomeDrawer;


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;

    const getIconName = (routeName: string) => {
        switch (routeName) {
            case 'Personal':
                return 'folder';
            // Add more cases as needed for each screen
            case 'Community':
                return 'folder-open-sharp';
            case 'Categories':
                return 'aperture-outline';
            default:
                return 'home';
        }
    }

    return (
        <DrawerContentScrollView {...props}>
            <View
                className='flex-row justify-between items-center px-[8] mb-6 mt-4'>
                <Logo withName size='sm' />
            </View>
            <View>
                {state.routes.map((route, index) => {
                    const focused = index === state.index;
                    const iconName = getIconName(route.name);

                    return (
                        <DrawerItem
                            key={route.key}
                            label={route.name}
                            focused={focused}
                            onPress={() => navigation.navigate(route.name)}
                            icon={({ size, color }) => (
                                <Ionicons name={iconName} size={size} color={color} />
                            )}
                            activeTintColor={colors.accent}
                            inactiveTintColor={tailwindColors.gray[300]}
                            style={{ padding: 0, }}
                        />
                    );
                })}
            </View>
        </DrawerContentScrollView>
    )
}
