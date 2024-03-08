import { doc, setDoc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";

interface CreateUserProp {
    username: string
    photoURL?: string
    email: string
    uid: string
}

export const createUser = async (data: CreateUserProp) => {
  try {
    await setDoc(doc(firestoreDB, "users", data.uid), data);
    return true; // Return true if the operation was successful
  } catch (error) {
    console.error('Error creating user:', error);
    return false; // Return false if there was an error
  }
}

export const updateUser = async (uid: string, data: { [key: string]: any }) => {
    try {
      await updateDoc(doc(firestoreDB, "users", uid), data);
      return true; // Return true if the operation was successful
    } catch (error) {
      console.error('Error updating user:', error);
      return false; // Return false if there was an error
    }
  }