import { FieldValue, addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { errorToast } from "../toast.util";

interface FolderData {
    name: string;
    mode: string;
    dateCreated: FieldValue;
}


export async function uploadFolder (userId: string, folderData: FolderData, active: boolean): Promise<void> {
    try {
       const response = await addDoc(collection(firestoreDB, "users", userId, "folders"), {...folderData, items: 0});
        if(active) setActiveFolder(userId, response.id)
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
        if(active) setActiveFolder(userId, folderId)
        else{!active} removeActiveFolder(userId)
    })
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

function setActiveFolder(userId: string, folderId: string){
    const userRef = doc(firestoreDB, "users", userId)

    updateDoc(userRef, {activeFolder: folderId})
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

function removeActiveFolder(userId: string){
    const userRef = doc(firestoreDB, "users", userId)

    updateDoc(userRef, {activeFolder: null})
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

