import {create} from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from 'firebaseConfig';
import { FolderProps } from '@components/Home/type';
import { doc, getDoc } from 'firebase/firestore';

// Create a store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Monitor the user's authentication state
onAuthStateChanged(firebaseAuth, async (user) => {
  if (user) {
    const userRef = doc(firestoreDB, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const firestoreUser = docSnap.data() as CustomFireStoreUserProps;
      useAuthStore.getState().setUser(firestoreUser);

    } else {
      console.log("No such document!");
    }
  } else {
    useAuthStore.getState().setUser(null);
  }
});




// types
interface AuthState {
    user: CustomFireStoreUserProps | null;
    setUser: (user: CustomFireStoreUserProps | null) => void;
}

interface CustomFireStoreUserProps {
    uid: string;
    username: string;
    email: string;
    // photoURL: string;
    folders: FolderProps[];
    activeFolder: ActiveFolderProps | null;
}

export interface ActiveFolderProps {
  folderId: string;
  folderCategory: string;
}






