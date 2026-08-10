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

// Product photos straight off a phone camera can be 3-8MB, which makes
// Next.js's image optimizer time out fetching them from BunnyCDN. This
// resizes anything above MAX_DIMENSION and re-encodes as JPEG at a solid
// quality before upload, so files land closer to a few hundred KB.
const MAX_DIMENSION = 2000;
const COMPRESS_QUALITY = 0.82;

export async function compressImage(file: File): Promise<File> {
  // Nothing worth compressing further.
  if (file.size < 400 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", COMPRESS_QUALITY)
    );

    if (!blob || blob.size >= file.size) return file;

    return new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, "") + ".jpg",
      { type: "image/jpeg" }
    );
  } catch {
    // If compression fails for any reason, fall back to the original file
    // rather than blocking the upload.
    return file;
  }
}