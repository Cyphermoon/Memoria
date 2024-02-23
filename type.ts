import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {  GoalItemProps } from "./src/components/Goal/type";
import { SelectedGoalProps } from "./src/components/Home/type";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { HomeDrawerParamList } from "src/navigation/HomeDrawer";

export type HomeStackParamList = {
    HomeDrawer: DrawerNavigationProp<HomeDrawerParamList>
    AddCollection: undefined
    Goal: SelectedGoalProps
    GoalSlideShow: { currentId: string, goals: GoalItemProps[] }
    NewGoalItem: {goalFolderId?: string, unsplashImage?: UnsplashResult}
    EditGoalItem: {goalItem: GoalItemProps}
    UnSplashModal: undefined
  };

  export type AuthStackParamList = {
    onBoarding: undefined
    Splash: undefined
    Auth: undefined
}

export type RootStackParamList = {
  HomeNavigator: NativeStackNavigationProp<HomeStackParamList>;
  AuthNavigator: NativeStackNavigationProp<AuthStackParamList>;
}

