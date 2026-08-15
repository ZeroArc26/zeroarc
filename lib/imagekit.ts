import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

/**
 * Deletes a file from ImageKit given its public CDN URL (the same URL
 * shape returned by POST /api/upload: `${IMAGEKIT_URL_ENDPOINT}/<folder>/<filename>`).
 *
 * ImageKit's delete API needs a fileId, not a URL, so this first looks
 * the file up by its path via listFiles, then deletes by the resolved
 * fileId. Mirrors the old deleteFromBunny(fileUrl) signature so callers
 * didn't need to change.
 */
export async function deleteFromImageKit(fileUrl: string): Promise<boolean> {
  try {
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!urlEndpoint || !fileUrl.startsWith(urlEndpoint)) {
      console.error("IMAGEKIT DELETE: URL doesn't match configured endpoint", {
        fileUrl,
        urlEndpoint,
      });
      return false;
    }

    // Everything after the URL endpoint is the "<folder>/<filename>" path.
    const path = fileUrl.slice(urlEndpoint.length).replace(/^\/+/, "");
    const filename = path.split("/").pop() || "";
    const folderPath = "/" + path.split("/").slice(0, -1).join("/");

    const matches = await imagekit.listFiles({
      path: folderPath,
      searchQuery: `name="${filename}"`,
      limit: 1,
    });

    const file = matches[0];

    if (!file || !("fileId" in file)) {
      console.error("IMAGEKIT DELETE: file not found", { fileUrl, path });
      return false;
    }

    await imagekit.deleteFile(file.fileId);
    return true;
  } catch (error) {
    console.error("IMAGEKIT DELETE ERROR:", error);
    return false;
  }
}
