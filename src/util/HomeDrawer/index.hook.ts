import { doc, onSnapshot } from "firebase/firestore";
import { firestoreDB } from "firebaseConfig";
import { useEffect, useState } from "react";
import { ActiveFolderProps } from "store/authStore";

export function useActiveFolder(userId?: string) {
    const [activeFolder, setActiveFolderId] = useState<ActiveFolderProps | null>(null)

    useEffect(() => {
        if (!userId) return
        const folderRef = doc(firestoreDB, "users", userId);

        const unsubscribe = onSnapshot(folderRef, (doc) => {
            setActiveFolderId(doc.data()?.activeFolder)
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [userId])

    return activeFolder
}