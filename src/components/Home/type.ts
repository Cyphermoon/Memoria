import { Timestamp } from "firebase/firestore"

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
    id: string
    name: string
    items: number
    mode: CollectionOptionTypes
    dateCreated: Timestamp
    interval: string
}

export interface FolderPropsWithActive extends FolderProps {
    active: boolean
}

export interface FirestoreCommunityFolderProps{
    id: string
    name: string
    items: number
    mode: CollectionOptionTypes
    interval: string
    dateCreated: Timestamp
    likes:string[]
    activeCount: string[]
    user: {
        image_url?: string
        name: string
        id: string
    }
}

export interface CustomCommunityFolderProps extends FirestoreCommunityFolderProps {
    liked: boolean
    active: boolean
}

