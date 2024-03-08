import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { errorToast } from "../toast.util";
import { FolderProps } from "@components/Home/type";

interface FolderData {
    name: string;
    mode: string;
    active: boolean;
}


export async function uploadFolder (userId: string, folderData: FolderData): Promise<void> {
    try {
        await addDoc(collection(firestoreDB, "users", userId, "folders"), {...folderData, items: 0});
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

export function editFolder(userId: string, folderId: string, folderData: {[key: string]: any}){
    const folderRef = doc(firestoreDB, "users", userId, "folders", folderId)

    updateDoc(folderRef, folderData)
    .catch(() => {
        errorToast("An Error occured while updating this folder item. Please try again later.")
    })
}

