import {create} from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from 'firebaseConfig';

// Create a store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Monitor the user's authentication state
onAuthStateChanged(firebaseAuth, (user) => {
  useAuthStore.getState().setUser(user);
});




// types
interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
}





