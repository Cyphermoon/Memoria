import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeDrawerParamList } from "src/navigation/HomeDrawer";
import { GoalItemProps } from "./src/components/Goal/type";
import { CommunityFolderProps, FolderPropsWithActive, SelectedFolderProps } from "./src/components/Home/type";

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

