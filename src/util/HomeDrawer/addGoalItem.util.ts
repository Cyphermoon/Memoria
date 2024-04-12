import { Timestamp, addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { firestoreDB } from "firebaseConfig";
import { successToast } from "../toast.util";
import { AddFolderItemProps, CloudinaryResponse, EditFolderItemProps, ImageUploadType } from "./type";
import { CollectionOptionTypes } from "@components/Home/type";
import SHA1 from 'crypto-js/sha1';
import { truncateText } from "..";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqebv2gce/image';

// This function uploads an image to Cloudinary.
export async function uploadImage(data: string, type: ImageUploadType, name: string, public_id?: string): Promise<CloudinaryResponse> {
    const url = `${CLOUDINARY_URL}/upload`;
    // Create a new FormData instance to hold the image data.
    const formData = new FormData();

    // Check if the upload type is 'file'.
    const isFileUpload = type === 'file';

    // If it's a file upload, append the file to the form data.
    // Otherwise, append the data as a string.
    if (isFileUpload) {
        formData.append('file', {
            uri: data,
            name,
        } as any);
    } else {
        formData.append('file', data);
    }

    // Append folder path to the form data
    formData.append('folder', 'Memoria');

    // Append the upload preset to the form data.
    formData.append('upload_preset', 'memoria_preset');
    public_id && formData.append('public_id', public_id)

    // Define the options for the fetch request.
    // If it's a file upload, don't set the 'Content-Type' header.
    const options = {
        method: 'POST',
        body: formData,
        headers: isFileUpload ? undefined : { 'Content-Type': 'application/json' },
    };

    try {

        // Send the fetch request to the Cloudinary URL.
        const response = await fetch(url, options);

        // If the response is not OK, throw an error.
        if (!response.ok) {
            const message = await response.json();
            console.error('Error uploading image: ', message);
            throw new Error(`Error uploading image: ${message} `);
        }

        // Parse the response data as JSON.
        const jsonData: CloudinaryResponse = await response.json();

        // Return the URL of the uploaded image.
        return jsonData;
    } catch (error) {
        throw new Error(`${error}`);

    }
}

export async function deleteImageFromCloudinary(publicId: string) {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET}`;
    const signature = SHA1(paramsToSign).toString();

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY as string);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    try {
        const response = await fetch(`${CLOUDINARY_URL}/destroy`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.result !== 'ok') {
            throw new Error('Failed to delete image from Cloudinary');
        }
    } catch (error) {
        console.error('Error deleting image from Cloudinary: ', error);
    }
}


// This function uploads a folder item to Firestore.
export async function uploadFolderItem(userId: string, folderId: string, item: AddFolderItemProps, type: CollectionOptionTypes) {
    // Declare a variable to hold the reference to the Firestore collection.
    let folderRef;

    // If the type is 'personal', set the folderRef to point to the 'users/{userId}/folders' collection.
    if (type === 'personal') {
        folderRef = collection(firestoreDB, 'users', userId, 'folders', folderId, 'items');
    } else {
        // If the type is not 'personal' (i.e., it's 'community'), set the folderRef to point to the 'community' collection.
        folderRef = collection(firestoreDB, 'community', folderId, 'items');
    }

    try {
        // Try to add the item to the specified collection.
        const res = await addDoc(folderRef, item);
        return res.id
    } catch (error) {
        // If there's an error adding the item, log the error.
        console.error('Error uploading folder item: ', error);
    }
}

// This function deletes a folder item from Firestore.
export async function deleteFolderItem(userId: string, folderId: string, itemId: string, type: CollectionOptionTypes) {
    // Declare a variable to hold the reference to the Firestore document.
    let folderItemRef;

    // If the type is 'personal', set the folderItemRef to point to the 'users/{userId}/folders/{folderId}/items/{itemId}' document.
    if (type === 'personal') {
        folderItemRef = doc(firestoreDB, 'users', userId, 'folders', folderId, 'items', itemId);
    } else {
        // If the type is not 'personal' (i.e., it's 'community'), set the folderItemRef to point to the 'community/{folderId}/items/{itemId}' document.
        folderItemRef = doc(firestoreDB, 'community', folderId, 'items', itemId);
    }

    try {
        // Try to delete the item from the specified collection.
        await deleteDoc(folderItemRef);
    } catch (error) {
        // If there's an error deleting the item, log the error.
        console.error('Error deleting folder item: ', error);
    }
}

// This function edits a folder item in Firestore.
export async function editFirestoreFolderItem(userId: string, folderId: string, itemId: string, type: CollectionOptionTypes, newData: EditFolderItemProps) {
    // Declare a variable to hold the reference to the Firestore document.
    let folderItemRef;

    // If the type is 'personal', set the folderItemRef to point to the 'users/{userId}/folders/{folderId}/items/{itemId}' document.
    if (type === 'personal') {
        folderItemRef = doc(firestoreDB, 'users', userId, 'folders', folderId, 'items', itemId);
    } else {
        // If the type is not 'personal' (i.e., it's 'community'), set the folderItemRef to point to the 'community/{folderId}/items/{itemId}' document.
        folderItemRef = doc(firestoreDB, 'community', folderId, 'items', itemId);
    }

    try {
        // Try to update the item in the specified collection with the new data.
        await updateDoc(folderItemRef, newData);
    } catch (error) {
        // If there's an error updating the item, log the error.
        console.error('Error updating folder item: ', error);
    }
}

export function applyEffectToCloudinaryImage(image: CloudinaryResponse, text: string) {
    const url = image.secure_url
    const transformedText = encodeURI(truncateText(text, 20))
    const textSize = Math.round(image.height * 0.05);
    const yOffset = Math.round(image.height / 6)
    const effect = `/co_rgb:000000,e_colorize:40/co_rgb:DDD9D9,l_text:georgia_${textSize}_italic_normal_left:${transformedText}/fl_layer_apply,g_north,x_-30,y_${yOffset}`;
    const splitIndex = url.indexOf("/upload") + "/upload".length

    return url.slice(0, splitIndex) + `/${effect}` + url.slice(splitIndex)

}
