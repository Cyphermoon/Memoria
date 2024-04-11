import { FieldValue, Timestamp } from "firebase/firestore";

// types
export type ImageUploadType = 'file' | 'base64' | 'url';

export type AddFolderItemProps = {
  description: string;
  generationMode: string;
  dateCreated: FieldValue
  aiTitle?: string;
  aiActionWord?: string;
  image: CloudinaryResponse
};

export type FolderItemProps = AddFolderItemProps & {
  id: string;
}

export type EditFolderItemProps = {
  description: string;
  generationMode: string;
  image: CloudinaryResponse;
  id: string;
}

export type CloudinaryResponse = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
};