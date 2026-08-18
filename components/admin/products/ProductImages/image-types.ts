export type UploadStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "uploaded"
  | "failed";

export interface ProductImage {
  id: string;

  color: string;

  // Only present for a freshly-selected local file. Images already
  // saved in the database (loaded when editing an existing product)
  // have no local File — just a `url` — since they were uploaded in
  // a previous session.
  file?: File;

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