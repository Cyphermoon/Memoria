import { CollectionOptionTypes } from "@components/Home/type"
import { collection, doc, getDoc, getDocs, increment, updateDoc } from "firebase/firestore"
import { firestoreDB } from "firebaseConfig"
import { ActiveFolderProps, useAuthStore } from "store/authStore"
import { FolderItemProps } from "../HomeDrawer/type"
import { errorToast } from "../toast.util"

// Types
export type ActiveFolderAndItemResponse = {
	folderItem: FolderItemProps | null
	folderCategory?: CollectionOptionTypes | null
	folderIdx?: number | null
	folderItemsLength?: number | null
	folderId?: string | null
}

// Firestore

/**
 * This function retrieves the active folder of a specified user from Firestore.
 * If the user or the 'activeFolder' field does not exist, it returns null.
 */
export async function getUserActiveFolder(userId?: string): Promise<ActiveFolderProps | null> {
	// If no user ID is provided, return null
	if (!userId) {
		return null
	}

	// Get a reference to the user's document in the Firestore database
	const folderRef = doc(firestoreDB, "users", userId)

	// Fetch the document data
	const docSnap = await getDoc(folderRef)

	// If the document exists, return the 'activeFolder' field from the document data
	// If the 'activeFolder' field does not exist, return null
	if (docSnap.exists()) {
		return docSnap.data()?.activeFolder || null
	}
	// If the document does not exist, return null
	else {
		return null
	}
}

/**
 * This function updates the index of an item in a user's personal folder in Firestore.
 * It either sets the index to a specific value or increments it by a certain amount.
 */
export async function updatePersonalFolderItemIdx(
	userId: string,
	folderId: string,
	incrementValue: number,
	setToValue?: number
): Promise<void> {
	// Check if the user ID and folder ID are provided
	if (!userId || !folderId) {
		throw new Error("User ID and Folder ID are required")
	}

	// Get a reference to the user's folder document in Firestore
	const folderRef = doc(firestoreDB, "users", userId, "folders", folderId)

	// If setToValue is provided, set activeFolderItemIdx to setToValue
	if (setToValue !== undefined) {
		await updateDoc(folderRef, { activeFolderItemIdx: setToValue })
	}
	// If setToValue is not provided, increment activeFolderItemIdx by incrementValue
	else {
		await updateDoc(folderRef, { activeFolderItemIdx: increment(incrementValue) })
	}
}

/**
 * This function is used to update the activeFolderItemIdx of a user's active folder in Firestore.
 * It can either set the activeFolderItemIdx to a specific value or increment it by a certain amount.
 */
export async function updateUserActiveFolderItemIdx(
	userId: string,
	incrementValue: number,
	setToValue?: number
): Promise<void> {
	// Check if the user ID is provided
	if (!userId) {
		throw new Error("User ID is required")
	}

	// Get a reference to the user's document in Firestore
	const userRef = doc(firestoreDB, "users", userId)

	// If setToValue is provided, set activeFolderItemIdx to setToValue
	if (setToValue !== undefined) {
		await updateDoc(userRef, { "activeFolder.activeFolderItemIdx": setToValue })
	}
	// If setToValue is not provided, increment activeFolderItemIdx by incrementValue
	else {
		await updateDoc(userRef, { "activeFolder.activeFolderItemIdx": increment(incrementValue) })
	}
}

/**
 * This function fetches items from a user's personal or community folder in Firestore.
 * It determines the folder type, sets the Firestore collection reference accordingly,
 * retrieves a snapshot of the collection, and returns an array of the folder items.
 */
export async function getFolderItems(
	userId: string,
	folder: { id: string; category: CollectionOptionTypes }
): Promise<FolderItemProps[]> {
	// Initialize the folderItem reference
	let folderItemRef = null

	// Update the folderItem reference based on the folder mode
	if (folder.category === "personal") {
		folderItemRef = collection(firestoreDB, "users", userId, "folders", folder.id, "items")
	} else if (folder.category === "community") {
		folderItemRef = collection(firestoreDB, "community", folder.id, "items")
	}

	// Exit the code if for some reason the folderItemRef is null
	if (!folderItemRef) {
		throw new Error("Folder item reference is null")
	}

	// Get a snapshot of the folderItem collection
	const querySnapshot = await getDocs(folderItemRef)
	const items: FolderItemProps[] = []

	querySnapshot.forEach(doc => {
		// Update the temporary items array with the data from the document
		items.push({ id: doc.id, ...doc.data() } as FolderItemProps)
	})

	// Return the items array
	return items
}

/**
 * This function updates the index of an item in both the active folder and a personal folder for a user in Firestore.
 * It either sets the index to a specific value or increments it by a certain amount.
 */
export async function updateFolderAndActiveFolder(incrementValue: number, folderId: string, setToValue?: number) {
	// Get the user ID from the auth store
	const userId = useAuthStore.getState().user?.uid

	// If the user ID is not found, log an error message and return
	if (!userId) {
		console.error("User ID not found")
		return
	}

	// Update the index of the item in the active folder
	await updateUserActiveFolderItemIdx(userId, incrementValue, setToValue)
	// Update the index of the item in the personal folder
	await updatePersonalFolderItemIdx(userId, folderId, incrementValue, setToValue)
}

/**
 * This function retrieves the image URL of the currently active item in a user's active folder.
 * It fetches the active folder, gets all items within it, and identifies the active item.
 * If the active item index exceeds the number of items, it resets the index to zero.
 * It returns an object containing the active item, folder category, and the active index.
 */
export async function getActiveFolderItemImageURL(
	userId: string | undefined,
	activeFolder: ActiveFolderProps | null
): Promise<ActiveFolderAndItemResponse | null> {
	try {
		// If the user ID is not found, throw an error
		if (!userId) throw new Error("User Id not found")

		// Get the active folder of the user

		let activeFolderItemIdx = activeFolder?.activeFolderItemIdx

		//Let the user know if there is no active folder
		if (activeFolder === null || activeFolderItemIdx === undefined) {
			errorToast("No active folder found")
			return null
		}

		// If the active folder exists, get the items in the folder
		const folderItems =
			activeFolder &&
			(await getFolderItems(userId, {
				id: activeFolder.folderId,
				category: activeFolder?.folderCategory,
			}))

		//Make the active FolderIdx the first item it it exceeds the folderItems Length
		if (activeFolderItemIdx > folderItems.length - 1) {
			activeFolderItemIdx = 0
			activeFolder.folderCategory === "personal" && updateFolderAndActiveFolder(0, activeFolder.folderId, 0)
			activeFolder.folderCategory === "community" && updateUserActiveFolderItemIdx(userId, 0, 0)
		}

		// Make the the activeFolderItemIdx the last item if it is less than 0
		if (activeFolderItemIdx < 0) {
			activeFolderItemIdx = folderItems.length - 1
			activeFolder.folderCategory === "personal" &&
				updateFolderAndActiveFolder(0, activeFolder.folderId, folderItems.length - 1)
			activeFolder.folderCategory === "community" && updateUserActiveFolderItemIdx(userId, folderItems.length - 1)
		}

		if (folderItems.length <= 0) {
			return null
		}
		// Get the current folder item based on the active folder item index
		const currentFolderItem = folderItems && folderItems[activeFolderItemIdx]

		// Return an object containing the current folder item, the folder category, and the folder index
		return {
			folderItem: currentFolderItem,
			folderCategory: activeFolder?.folderCategory,
			folderIdx: activeFolderItemIdx,
			folderItemsLength: folderItems.length,
			folderId: activeFolder.folderId,
		}
	} catch (err) {
		// If an error occurs, log the error and return null
		console.error(err)
		return null // Return null if an error occurs
	}
}
