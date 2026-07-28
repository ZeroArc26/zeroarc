export const MAX_IMAGES = 10;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ACCEPTED_TYPES = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "image/avif": [],
};

export function generateImageId() {
  return crypto.randomUUID();
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });

      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image."));
    };

    image.src = url;
  });
}