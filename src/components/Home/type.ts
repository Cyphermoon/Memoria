export interface SelectedFolderProps {
    id: string
    name: string
}

export type SortOptionProp = {
    title: string
    id: string

}

export interface CommunitySelectedGoal extends SelectedFolderProps {
    liked: boolean
}

export type CollectionOptionTypes = 'personal' | 'community'

export type SelectedCollectionModeProps =
    { label: "Personal", value: "personal" } |
    { label: "Community", value: "community" };

export interface FolderProps {
    id: string;
    name: string;
    items: number;
    mode: CollectionOptionTypes
}

export interface FolderPropsWithActive extends FolderProps {
    active: boolean
}

