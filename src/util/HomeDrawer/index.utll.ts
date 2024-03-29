import { FieldValue, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { errorToast } from "../toast.util";
import { CollectionOptionTypes, SortOptionProp } from "@components/Home/type";
import { ActiveFolderProps } from "store/authStore";
import { DEFAULT_ACTIVE_FOLDER_ITEM_IDX, IntervalValueTypes } from "settings";

interface FolderData {
    name: string;
    mode: string;
    interval: IntervalValueTypes
    dateCreated: FieldValue;
    activeFolderItemIdx: number;
}

interface CommunityFolderData extends Omit<FolderData, "activeFolderItemIdx"> {
    likes: number
    items: number
    user: {
        image_url?: string
        name: string
        id: string
    }
}

// This is an asynchronous function that sets the active folder for a user.
async function setUserActiveFolder(userId: string, folderId: string, folderCategory: CollectionOptionTypes, activeItemIdx?: number) {
    // Create a reference to the user's document in the Firestore database.
    const userRef = doc(firestoreDB, "users", userId)

    try {
        // If an active item index is provided...
        if (activeItemIdx !== undefined && activeItemIdx !== null) {
            // Update the user's document with the new active folder and the active item index.
            await updateDoc(userRef, { activeFolder: { folderId, folderCategory, activeFolderItemIdx: activeItemIdx } })
        } else {
            // If no active item index is provided, update the user's document with the new active folder only.
            await updateDoc(userRef, { "activeFolder.folderId": folderId, "activeFolder.folderCategory": folderCategory })
        }
        // Return the folder ID and category.
        return { folderId, folderCategory }

    } catch (err) {
        // If an error occurs, display a toast notification with an error message.
        errorToast("An Error occured while updating this folder item. Please try again later.")
    }
}


/**
 * This function removes the active folder for a specified user in Firestore. 
 * It sets the 'activeFolder' field of the user document to null.
 */
function removeActiveFolder(userId: string) {
    // Get a reference to the user's document in Firestore
    const userRef = doc(firestoreDB, "users", userId)

    // Update the 'activeFolder' field of the user document to null
    updateDoc(userRef, { activeFolder: null })
        .catch(() => {
            // If an error occurs during the update, display an error toast
            errorToast("An Error occured while updating this folder item. Please try again later.")
        })
}

/* ============================ Folder Action =================================== */
export async function uploadFolder(userId: string, folderData: FolderData, active: boolean): Promise<void> {
    try {
        const response = await addDoc(collection(firestoreDB, "users", userId, "folders"), { ...folderData, items: 0 });
        if (active) await setUserActiveFolder(userId, response.id, "personal", folderData.activeFolderItemIdx)
    } catch (error) {
        errorToast("An Error Occurred while creating your folder. Please try again later.")
    }
}

export function deleteFolder(userId: string, folderId: string) {
    const goalRef = doc(firestoreDB, "users", userId, "folders", folderId,);

    deleteDoc(goalRef)
        .catch((error) => {
            errorToast("An Error occured while deleting this folder item. Please try again later.")
            console.error(error)
        });
}

export async function editFolder(userId: string, folderId: string, folderData: { [key: string]: any }, active: boolean | null) {
    try {
        const folderRef = doc(firestoreDB, "users", userId, "folders", folderId)

        // Intentionally not updating the activeFolderItemIdx since I have a better way of updating it, but i'm leaving the functionality incase I create a UI to update it.


        await updateDoc(folderRef, folderData)

        // do not change the active state it is null
        if (active === null) return

        // if active is true, set the folder as the user's active folder
        if (active) {
            const activeFolder = await setUserActiveFolder(userId, folderId, "personal", folderData.activeFolderItemIdx)
            return activeFolder
        }

        // if active is false, remove the folder as the user's active folder
        else if (!active) {
            await removeActiveFolder(userId)
        }
    } catch (error) {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    }
}
/* ========================================== Community Folder Action ========================================== */
// Define the async function
export async function uploadCommunityFolder(folderData: CommunityFolderData) {
    try {
        // Get a reference to the community collection
        const communityCollectionRef = collection(firestoreDB, "community")

        // Add a new document to the collection with the provided data
        await addDoc(communityCollectionRef, folderData)
    } catch (error) {
        // If an error occurs, show an error toast
        errorToast("An Error occured while uploading this folder item. Please try again later.")
    }
}

export function deleteCommunityFolder(folderId: string) {
    const communityRef = doc(firestoreDB, "community", folderId)

    deleteDoc(communityRef)
        .catch(() => {
            errorToast("An Error occured while deleting this folder item. Please try again later.")
        })
}

// Define the async function
export async function editCommunityFolder(folderId: string, folderData: { [key: string]: any }, isActive?: boolean) {
    try {
        // Get a reference to the community folder document
        const communityRef = doc(firestoreDB, "community", folderId)

        // Update the document with the new data
        await updateDoc(communityRef, folderData)

        // If isActive is null, do nothing and return
        if (isActive === null) return

        // If isActive is true, activate the folder
        if (isActive === true) {
            await activateFolder(folderData.user.id, folderId, DEFAULT_ACTIVE_FOLDER_ITEM_IDX)
        }

        // If isActive is false, deactivate the folder
        if (isActive === false) {
            await deActivateFolder(folderData.user.id, folderId)
        }
    } catch (error) {
        // If an error occurs, show an error toast
        errorToast("An Error occured while updating this folder item. Please try again later.")
    }
}

export async function handleSortChanged(sortOption: SortOptionProp, userId?: string) {
    // Update Firebase document
    if (userId) {
        const userDocRef = doc(firestoreDB, 'users', userId);
        await updateDoc(userDocRef, {
            communitySort: sortOption
        });
    }
};

// Function to like a post
export async function likeFolder(folderId: string, userId: string) {
    const folderRef = doc(firestoreDB, 'community', folderId);
    const likesCollectionRef = collection(firestoreDB, 'likes');

    // Add the user's ID to the post's list of likes
    await updateDoc(folderRef, {
        likes: arrayUnion(userId)
    });

    // Add a new document to the likes collection with the user ID and post ID
    const likeDoc = await addDoc(likesCollectionRef, {
        userId: userId,
        folderId: folderId
    });

    return likeDoc.id; // Return the ID of the new like document
}

// Function to unlike a post
export async function unLikeFolder(folderId: string, userId: string) {
    const folderRef = doc(firestoreDB, 'community', folderId);
    const likesCollectionRef = collection(firestoreDB, 'likes');

    // Remove the user's ID from the post's list of likes
    await updateDoc(folderRef, {
        likes: arrayRemove(userId)
    });

    // Delete the document in the likes collection for this user and post
    const q = query(likesCollectionRef, where('userId', '==', userId), where('postId', '==', folderId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const likeDoc = querySnapshot.docs[0];
        await deleteDoc(likeDoc.ref);
    }
}

export async function activateFolder(userId: string, folderId: string, activeFolderItemIdx: number, previousFolder?: ActiveFolderProps | null) {
    // reference the community folder
    const communityFolderRef = doc(firestoreDB, "community", folderId)

    // remove the user from the previous active folder
    if (previousFolder !== undefined && previousFolder && previousFolder?.folderCategory === "community") {
        const prevFolderRef = doc(firestoreDB, "community", previousFolder.folderId)
        await updateDoc(prevFolderRef, {
            "activeCount": arrayRemove(userId)
        })
    }

    // make that new folder the user's active folder
    await setUserActiveFolder(userId, folderId, "community", activeFolderItemIdx)

    // update the likes activeCount array to include the user
    await updateDoc(communityFolderRef, {
        "activeCount": arrayUnion(userId)
    })

}

export async function deActivateFolder(userId: string, folderId: string) {
    // reference the community folder
    const communityFolderRef = doc(firestoreDB, "community", folderId)

    // update the likes activeCount array to remove the user
    await updateDoc(communityFolderRef, {
        "activeCount": arrayRemove(userId)
    })

    // remove the folder as the user's active folder
    removeActiveFolder(userId)

}

