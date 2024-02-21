import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {  GoalItemProps } from "./src/components/Goal/type";
import { SelectedGoalProps } from "./src/components/Home/type";

export type HomeStackParamList = {
    onBoarding: undefined
    Splash: undefined
    Auth: undefined
    HomeScreen: undefined
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

