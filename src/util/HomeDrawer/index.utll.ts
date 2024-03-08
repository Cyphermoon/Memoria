import { addDoc, collection } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { errorToast } from "../toast.util";

interface FolderData {
    name: string;
    mode: string;
    active: boolean;
}

type UploadFolderFunction = (userId: string, folderData: FolderData) => Promise<void>;

export const uploadFolder: UploadFolderFunction = async (userId, folderData) => {
    try {
        await addDoc(collection(firestoreDB, "users", userId, "folders"), folderData);
    } catch (error) {
        errorToast("An Error Occurred while creating your folder. Please try again later.")
    }
}