import { FieldValue, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { errorToast } from "../toast.util";
import { CollectionOptionTypes, SortOptionProp } from "@components/Home/type";

interface FolderData {
    name: string;
    mode: string;
    dateCreated: FieldValue;
}

interface CommunityFolderData extends FolderData {
    likes: number
    items: number
    user: {
        image_url?: string
        name: string
        id: string
    }
}

async function setActiveFolder(userId: string, folderId: string, folderCategory: CollectionOptionTypes){
    const userRef = doc(firestoreDB, "users", userId)

    try{
        await updateDoc(userRef, {activeFolder: { folderId, folderCategory}})
        return {folderId, folderCategory}

    }catch(err){
        errorToast("An Error occured while updating this folder item. Please try again later.")
    }
}


function removeActiveFolder(userId: string){
    const userRef = doc(firestoreDB, "users", userId)

    updateDoc(userRef, {activeFolder: null})
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

/* ============================ Folder Action =================================== */
export async function uploadFolder (userId: string, folderData: FolderData, active: boolean): Promise<void> {
    try {
       const response = await addDoc(collection(firestoreDB, "users", userId, "folders"), {...folderData, items: 0});
        if(active) setActiveFolder(userId, response.id, "personal")
    } catch (error) {
        errorToast("An Error Occurred while creating your folder. Please try again later.")
    }
}

export function deleteFolder(userId: string, folderId: string){
    const goalRef = doc(firestoreDB, "users", userId, "folders", folderId, ); 
  
    deleteDoc(goalRef)
      .catch((error) => {
        errorToast("An Error occured while deleting this folder item. Please try again later.")
        console.error(error)
      });
}

export function editFolder(userId: string, folderId: string, folderData: {[key: string]: any}, active: boolean){
    const folderRef = doc(firestoreDB, "users", userId, "folders", folderId)

    updateDoc(folderRef, folderData)
    .then(() => {
        if(active) setActiveFolder(userId, folderId, "personal")
        else if(!active) removeActiveFolder(userId)
    })
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

/* ========================================== Community Folder Action ========================================== */
export function uploadCommunityFolder(folderData: CommunityFolderData){
    const communityCollectionRef = collection(firestoreDB, "community")

    addDoc(communityCollectionRef, folderData)
    .catch(() => {
        errorToast("An Error occured while uploading this folder item. Please try again later.")
    })
}

export function deleteCommunityFolder(folderId: string){
    const communityRef = doc(firestoreDB, "community", folderId)

    deleteDoc(communityRef)
    .catch(() => {
        errorToast("An Error occured while deleting this folder item. Please try again later.")
    })
}

export function editCommunityFolder(folderId: string, folderData: {[key: string]: any}){
    const communityRef = doc(firestoreDB, "community", folderId)

    updateDoc(communityRef, folderData)
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

export async function handleSortChanged (sortOption: SortOptionProp, userId?: string){
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

export async function activateFolder(userId: string, folderId: string, prevFolderId?: string){
    // reference the community folder
    const communityFolderRef = doc(firestoreDB, "community", folderId)

    // remove the user from the previous active folder
    if(prevFolderId){
        const prevFolderRef = doc(firestoreDB, "community", prevFolderId)
        await updateDoc(prevFolderRef, {
            "activeCount": arrayRemove(userId)
        })
    }

    // make that new folder the user's active folder
     await setActiveFolder(userId, folderId, "community")

    // update the likes activeCount array to include the user
    await updateDoc(communityFolderRef, {
        "activeCount": arrayUnion(userId)
    })

}

export async function deActivateFolder(userId: string, folderId: string){
    // reference the community folder
    const communityFolderRef = doc(firestoreDB, "community", folderId)

    // update the likes activeCount array to remove the user
    await updateDoc(communityFolderRef, {
        "activeCount": arrayRemove(userId)
    })

    // remove the folder as the user's active folder
    removeActiveFolder(userId)

}

