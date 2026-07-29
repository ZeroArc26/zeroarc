import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

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

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const filename = `${crypto.randomUUID()}-${file.name}`;


    const response = await fetch(
      `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/products/${filename}`,
      {
        method: "PUT",
        headers: {
          AccessKey:
            process.env.BUNNY_STORAGE_API_KEY!,
          "Content-Type":
            file.type,
        },
        body: buffer,
      }
    );


    if (!response.ok) {
      const errorText = await response.text();

      console.log(
        "BUNNY UPLOAD ERROR:",
        errorText
      );

      throw new Error(
        "Bunny upload failed"
      );
    }


    const url =
  `${process.env.BUNNY_CDN_URL}/products/${filename}`;


    return NextResponse.json({
      success: true,
      url,
    });


  } catch (error) {

    console.error(
      "UPLOAD ERROR:",
      error
    );


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