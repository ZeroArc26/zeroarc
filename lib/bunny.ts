/**
 * Deletes a file from BunnyCDN storage given its public CDN URL
 * (the same URL shape returned by POST /api/upload:
 * `${BUNNY_CDN_URL}/${folder}/${filename}`).
 *
 * Called directly as a function (not via a self-fetch to our own API)
 * so it works reliably from server actions/routes regardless of
 * NEXT_PUBLIC_APP_URL / domain state.
 */
export async function deleteFromBunny(fileUrl: string): Promise<boolean> {
  try {
    const cdnBase = process.env.BUNNY_CDN_URL;

    if (!cdnBase || !fileUrl.startsWith(cdnBase)) {
      console.error("BUNNY DELETE: URL doesn't match configured CDN base", {
        fileUrl,
        cdnBase,
      });
      return false;
    }

    // Everything after the CDN base is the "<folder>/<filename>" path
    // BunnyCDN's storage API expects.
    const path = fileUrl.slice(cdnBase.length).replace(/^\/+/, "");

    const response = await fetch(
      `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${path}`,
      {
        method: "DELETE",
        headers: {
          AccessKey: process.env.BUNNY_STORAGE_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BUNNY DELETE ERROR:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("BUNNY DELETE ERROR:", error);
    return false;
  }
}