import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { code } = await params;

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { success: false, message: "Invalid pincode." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
    const data = await res.json();

    const postOffice = data?.[0]?.PostOffice?.[0];

    if (data?.[0]?.Status !== "Success" || !postOffice) {
      return NextResponse.json(
        { success: false, message: "Pincode not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      city: postOffice.District,
      state: postOffice.State,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Lookup failed." },
      { status: 500 }
    );
  }
}
