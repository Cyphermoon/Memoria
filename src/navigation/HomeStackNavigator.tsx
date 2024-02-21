import HeaderCancelButton from "@components/AddGoalItem/HeaderCancelButton"
import { GoalBackButton } from "@components/Goal/GoalBackButton"
import Text from "@components/common/Text"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AuthScreen from "@screens/AuthScreen"
import EditGoalItem from "@screens/EditGoalItem"
import GoalScreen from "@screens/GoalScreen"
import AddGoalItemModal from "@screens/GoalScreen/Modals/AddGoalItemModal"
import GoalSlideShowModal from "@screens/GoalScreen/Modals/GoalSlideShowModal"
import UnSplashModal from "@screens/GoalScreen/Modals/UnSplashModal"
import HomeScreen from "@screens/HomeScreen"
import AddCollectionModal from "@screens/HomeScreen/Modals/AddCollectionModal"
import OnBoardingScreen from "@screens/OnBoardingScreen"
import SplashScreen from "@screens/SplashScreen"
import colors from "colors"
import { HomeStackParamList } from "type"

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

// Define persistence key
const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <HomeStack.Group>
                <HomeStack.Screen name="onBoarding" component={OnBoardingScreen} />
                <HomeStack.Screen name="Auth" component={AuthScreen} />
                <HomeStack.Screen name="Home" component={HomeScreen} />
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