import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getStoreSettings();

    return NextResponse.json({
      success: true,
      shipping: settings.shipping,
      store: {
        name: settings.store?.name,
        tagline: settings.store?.tagline,
      },
    });
  } catch (error) {
    console.error("Public Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}