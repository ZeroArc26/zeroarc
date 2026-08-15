import { NextResponse } from "next/server";

import { imagekit } from "@/lib/imagekit";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        {
          error: "File missing",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const filename = `${crypto.randomUUID()}-${file.name}`;

    const result = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: `/${folder}`,
      useUniqueFileName: false,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
