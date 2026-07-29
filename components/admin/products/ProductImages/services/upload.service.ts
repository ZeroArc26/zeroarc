export interface UploadResult {
  url: string;
}

export async function uploadImage(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  onProgress(10);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  onProgress(80);

  if (!response.ok) {
  const errorText = await response.text();

  console.log("UPLOAD ERROR RESPONSE:", errorText);

  throw new Error(errorText || "Upload failed.");
}

  const data = await response.json();

  onProgress(100);

  return {
    url: data.url,
  };
}