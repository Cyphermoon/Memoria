import HeaderCancelButton from "@components/AddGoalItem/HeaderCancelButton"
import { GoalBackButton } from "@components/Goal/GoalBackButton"
import Text from "@components/common/Text"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import EditGoalItem from "@screens/EditGoalItem"
import GoalScreen from "@screens/GoalScreen"
import AddGoalItemModal from "@screens/GoalScreen/Modals/AddGoalItemModal"
import GoalSlideShowModal from "@screens/GoalScreen/Modals/GoalSlideShowModal"
import UnSplashModal from "@screens/GoalScreen/Modals/UnSplashModal"
import AddCollectionModal from "@screens/HomeDrawer/Modals/AddCollectionModal"
import colors from "colors"
import { HomeStackParamList } from "type"
import HomeDrawer from "../HomeDrawer"

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

// Define persistence key
const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="HomeDrawer" screenOptions={{ headerShown: false }}>
            <HomeStack.Group>
                <HomeStack.Screen name="HomeDrawer" component={HomeDrawer} />
                <HomeStack.Screen
                    name="Goal"
                    component={GoalScreen}
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: colors.primary.DEFAULT },
                        headerLeft: () => <GoalBackButton />
                    }} />
                <HomeStack.Screen
                    name="EditGoalItem"
                    component={EditGoalItem}
                    options={{
                        headerShown: false,
                    }} />
            </HomeStack.Group>

            <HomeStack.Group >
                <HomeStack.Screen
                    name="AddCollection"
                    component={AddCollectionModal}
                    options={{ presentation: 'modal' }} />

                <HomeStack.Screen
                    name="GoalSlideShow"
                    component={GoalSlideShowModal}
                    options={{
                        presentation: 'card',
                        headerShown: false,
                        animation: "fade",
                    }} />

                <HomeStack.Screen
                    name="UnSplashModal"
                    component={UnSplashModal}
                    options={{
                        presentation: 'modal',
                        headerShown: false,
                    }} />

                <HomeStack.Screen
                    name='NewGoalItem'
                    component={AddGoalItemModal}
                    options={{
                        headerTitle: () => <Text className='text-xl text-secondary font-medium'>Add Goal</Text>,
                        headerBackVisible: false,
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: colors.primary.DEFAULT },
                        contentStyle: { flexDirection: 'row', alignItems: 'center' },
                        headerRight: () => <HeaderCancelButton />
                    }} />
            </HomeStack.Group>
        </HomeStack.Navigator>
    )
}

export default HomeStackNavigator