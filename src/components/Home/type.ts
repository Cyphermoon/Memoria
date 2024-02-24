export interface SelectedGoalProps {
    id: string
    name: string
}

export type SortOptionProp = {
    title: string
    id: string

}

export interface CommunitySelectedGoal extends SelectedGoalProps {
    liked: boolean
}

export type CollectionOptionTypes = 'personal' | 'community'

export type SelectedCollectionModeProps =
    { label: "Personal", value: "personal" } |
    { label: "Community", value: "community" }

