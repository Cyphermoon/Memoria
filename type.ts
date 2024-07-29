import { DrawerNavigationProp } from "@react-navigation/drawer"
import { HomeDrawerParamList } from "src/navigation/HomeDrawer"
import { EditFolderItemProps, FolderItemProps } from "src/util/HomeDrawer/type"
import {
	CollectionOptionTypes,
	CustomCommunityFolderProps,
	FolderProps,
	FolderPropsWithActive,
} from "./src/components/Home/type"
import { UnsplashResult } from "@components/Goal/unsplash.type"

export type HomeStackParamList = {
	HomeDrawer: DrawerNavigationProp<HomeDrawerParamList>
	AddCollection:
		| { mode: "personal"; folder?: FolderPropsWithActive }
		| { mode: "community"; folder?: CustomCommunityFolderProps }
	Goal: { folder: CustomCommunityFolderProps | FolderProps; isActive: boolean }
	GoalSlideShow: { currentId: string; goals: FolderItemProps[] }
	NewGoalItem: {
		folder?: { id: string; type: CollectionOptionTypes }
		unsplashImage?: UnsplashResult
		editFolderItem?: EditFolderItemProps
	}
	EditGoalItem: { goalItem: EditFolderItemProps }
	UnSplashModal: {
		editFolderItem?: EditFolderItemProps
		folder?: { id: string; type: CollectionOptionTypes }
	}
}

export type AuthStackParamList = {
	onBoarding: undefined
	Splash: undefined
	Auth: undefined
	Login: undefined
}

export type RootStackParamList = {
	HomeNavigator: undefined
	AuthNavigator: any
}
