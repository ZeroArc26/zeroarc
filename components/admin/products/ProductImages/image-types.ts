export type UploadStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "uploaded"
  | "failed";

export interface ProductImage {
  id: string;

  color: string;

  file: File;

  preview: string;

  isCover: boolean;

  status: UploadStatus;

  progress: number;

  uploaded: boolean;

  error?: string;

  url?: string;

  size: number;

  type: string;

  width?: number;

  height?: number;
}