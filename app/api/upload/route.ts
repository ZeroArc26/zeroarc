import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop() ?? "jpg";

    const filename = `products/${uuid()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await fetch(
      `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${filename}`,
      {
        method: "PUT",
        headers: {
          AccessKey:
            process.env.BUNNY_STORAGE_API_KEY!,
          "Content-Type": file.type,
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Bunny upload failed.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      url: `${process.env.BUNNY_CDN_URL}/${filename}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}