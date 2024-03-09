import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {  GoalItemProps } from "./src/components/Goal/type";
import { CollectionOptionTypes, CommunityFolderProps, FolderProps, FolderPropsWithActive, SelectedFolderProps } from "./src/components/Home/type";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { HomeDrawerParamList } from "src/navigation/HomeDrawer";

export type HomeStackParamList = {
    HomeDrawer: DrawerNavigationProp<HomeDrawerParamList>
    AddCollection: {mode: "personal", folder?:FolderPropsWithActive} | {mode: "community", folder?:CommunityFolderProps}
    Goal: SelectedFolderProps
    GoalSlideShow: { currentId: string, goals: GoalItemProps[] }
    NewGoalItem: {goalFolderId?: string, unsplashImage?: UnsplashResult}
    EditGoalItem: {goalItem: GoalItemProps}
    UnSplashModal: undefined
  };

  export type AuthStackParamList = {
    onBoarding: undefined
    Splash: undefined
    Auth: undefined
    Login: undefined
}

export type RootStackParamList = {
  HomeNavigator: undefined;
  AuthNavigator: NativeStackNavigationProp<AuthStackParamList>;
}

