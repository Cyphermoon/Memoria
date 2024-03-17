import { FieldValue, Timestamp } from "firebase/firestore";

// types
export type ImageUploadType = 'file' | 'base64' | 'url';

export type FolderItem = {
    imageUrl: string;
    description: string;
    generationMode: string;
    dateCreated: FieldValue
    aiTitle?: string;
    aiActionWord?: string;
  };
  
  type UploadType = 'personal' | 'community';