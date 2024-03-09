import { doc, onSnapshot } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { useEffect, useState } from "react";

export function useActiveFolderId (userId?: string){
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) return
        const folderRef = doc(firestoreDB, "users", userId); 

        const unsubscribe = onSnapshot(folderRef, (doc) => {
            setActiveFolderId(doc.data()?.activeFolder)
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [])

    return activeFolderId
}