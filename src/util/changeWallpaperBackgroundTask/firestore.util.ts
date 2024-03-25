import { collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from 'firebaseConfig';
import { ActiveFolderProps, useAuthStore } from 'store/authStore';
import { FolderItemProps } from '../HomeDrawer/type';
import { CollectionOptionTypes, FolderProps } from '@components/Home/type';
import { errorToast } from '../toast.util';

// Types
export type ActiveFolderAndItemResponse = {
    folderItem: FolderItemProps | null;
    folderCategory?: CollectionOptionTypes | null;
    folderIdx?: number | null;
    folderItemsLength?: number | null;
}

// Firestore
export async function getUserActiveFolder(
    userId?: string
): Promise<ActiveFolderProps | null> {
    if (!userId) {
        return null;
    }

    const folderRef = doc(firestoreDB, 'users', userId);
    const docSnap = await getDoc(folderRef);

    if (docSnap.exists()) {
        return docSnap.data()?.activeFolder || null;
    } else {
        return null;
    }
}

export async function updateUserActiveFolderItemIdx(
    userId: string,
    incrementValue: number,
    setToValue?: number
): Promise<void> {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const userRef = doc(firestoreDB, 'users', userId);

    if (setToValue !== undefined) {
        await updateDoc(userRef, { 'activeFolder.activeFolderItemIdx': setToValue });
    } else {
        await updateDoc(userRef, { 'activeFolder.activeFolderItemIdx': increment(incrementValue) });
    }
}


export async function getFolderItems(
    userId: string,
    folder: { id: string; category: CollectionOptionTypes }
): Promise<FolderItemProps[]> {
    // Initialize the folderItem reference
    let folderItemRef = null;

    // Update the folderItem reference based on the folder mode
    if (folder.category === 'personal') {
        folderItemRef = collection(
            firestoreDB,
            'users',
            userId,
            'folders',
            folder.id,
            'items'
        );
    } else if (folder.category === 'community') {
        folderItemRef = collection(firestoreDB, 'community', folder.id, 'items');
    }

    // Exit the code if for some reason the folderItemRef is null
    if (!folderItemRef) {
        throw new Error('Folder item reference is null');
    }

    // Get a snapshot of the folderItem collection
    const querySnapshot = await getDocs(folderItemRef);
    const items: FolderItemProps[] = [];

    querySnapshot.forEach((doc) => {
        // Update the temporary items array with the data from the document
        items.push({ id: doc.id, ...doc.data() } as FolderItemProps);
    });

    // Return the items array
    return items;
}

export async function updatePersonalFolderItemIdx(
    userId: string,
    folderId: string,
    incrementValue: number,
    setToValue?: number
): Promise<void> {
    if (!userId || !folderId) {
        throw new Error("User ID and Folder ID are required");
    }

    const folderRef = doc(firestoreDB, 'users', userId, 'folders', folderId);

    if (setToValue !== undefined) {
        await updateDoc(folderRef, { activeFolderItemIdx: setToValue });
    } else {
        await updateDoc(folderRef, { activeFolderItemIdx: increment(incrementValue) });
    }
}

export async function updateFolderAndActiveFolder(incrementValue: number, folderId: string, setToValue?: number) {
    const userId = useAuthStore.getState().user?.uid;

    if (!userId) {
        console.log('User ID not found')
        return
    }

    await updateUserActiveFolderItemIdx(userId, incrementValue, setToValue)
    await updatePersonalFolderItemIdx(userId, folderId, incrementValue, setToValue)

}


// This function is used to get the image URL of the active folder item
export async function getActiveFolderItemImageURL(): Promise<ActiveFolderAndItemResponse | null> {
    try {
        // Get the user ID from the auth store
        const userId = useAuthStore.getState().user?.uid;

        // If the user ID is not found, throw an error
        if (!userId) throw new Error('User Id not found');

        // Get the active folder of the user
        const activeFolder = await getUserActiveFolder(userId);
        let activeFolderIdx = activeFolder?.activeFolderItemIdx

        //Let the user know if there is no active folder
        if (activeFolder === null || activeFolderIdx === undefined) {
            errorToast('Please Make a folder active to change the wallpaper background')
            return null
        }

        // If the active folder exists, get the items in the folder
        const folderItems =
            activeFolder &&
            (await getFolderItems(userId, {
                id: activeFolder.folderId,
                category: activeFolder?.folderCategory,
            }));

        //Make the active FolderIdx the last item it it exceeds the folderItems Length
        if (activeFolderIdx > folderItems.length - 1) {
            activeFolderIdx = 0
            activeFolder.folderCategory === 'personal' && updateFolderAndActiveFolder(0, activeFolder.folderId, 0)
            activeFolder.folderCategory === 'community' && updateUserActiveFolderItemIdx(userId, 0, 0)
        }

        if (folderItems.length <= 0) {
            return null
        }
        // Get the current folder item based on the active folder item index
        const currentFolderItem =
            folderItems && folderItems[activeFolderIdx];

        // Return an object containing the current folder item, the folder category, and the folder index
        return {
            folderItem: currentFolderItem,
            folderCategory: activeFolder?.folderCategory,
            folderIdx: activeFolderIdx,
            folderItemsLength: folderItems.length
        };
    } catch (err) {
        // If an error occurs, log the error and return null
        console.error(err);
        return null; // Return null if an error occurs
    }
}