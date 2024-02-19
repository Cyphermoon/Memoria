import {  GoalItemProps } from "./src/components/Goal/type";
import { SelectedGoalProps } from "./src/components/Home/type";

export type RootStackParamList = {
    onBoarding: undefined
    Splash: undefined
    Auth: undefined
    Home: undefined
    AddCollection: undefined
    Goal: SelectedGoalProps
    GoalSlideShow: { currentId: string, goals: GoalItemProps[] }
    NewGoalItem: {goalFolderId: string, unsplash?: {uri: string, id: string}}
    EditGoalItem: {goalItem: GoalItemProps}
    UnSplashModal: undefined
  };