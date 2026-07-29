export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function validateImage(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be less than 5 MB.";
  }

  if (!(file.type in ACCEPTED_TYPES)) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }

  return null;
}

export function createPreview(file: File) {
  return URL.createObjectURL(file);
}

export function revokePreview(preview: string) {
  URL.revokeObjectURL(preview);
}