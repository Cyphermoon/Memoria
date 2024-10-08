import { CollectionOptionTypes, FolderProps } from "@components/Home/type"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { firebaseAuth, firestoreDB } from "firebaseConfig"
import { CloudinaryResponse } from "src/util/HomeDrawer/type"
import { create } from "zustand"

// Create a store
export const useAuthStore = create<AuthState>(set => ({
	user: null,
	setUser: user => set({ user }),
}))

// Listen for auth state changes
onAuthStateChanged(firebaseAuth, user => {
	if (user) {
		// Get the user's data from Firestore
		const userRef = doc(firestoreDB, "users", user.uid)

		// Listen for real-time updates to the user's data
		onSnapshot(userRef, docSnap => {
			if (docSnap.exists()) {
				// Get the user's data
				const firestoreUser = docSnap.data() as CustomFireStoreUserProps
				// Set the user's data in the store
				useAuthStore.getState().setUser(firestoreUser)
			} else {
				console.error("No such document!")
			}
		})
	} else {
		useAuthStore.getState().setUser(null)
	}
})

// types
interface AuthState {
	user: CustomFireStoreUserProps | null
	setUser: (user: CustomFireStoreUserProps | null) => void
}

export interface CustomFireStoreUserProps {
	uid: string
	username: string
	email: string
	image?: CloudinaryResponse
	folders: FolderProps[]
	activeFolder: ActiveFolderProps | null
}

export interface ActiveFolderProps {
	folderId: string
	folderCategory: CollectionOptionTypes
	activeFolderItemIdx: number
}
