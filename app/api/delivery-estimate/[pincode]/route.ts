import { NextResponse } from "next/server";

import { checkPincodeServiceability } from "@/lib/delhivery";

interface RouteParams {
  params: Promise<{ pincode: string }>;
}

// Same windows shown at checkout (SHIPPING_METHODS) — kept in sync
// manually since they're a small, rarely-changing store policy, not
// data that needs its own settings field.
const STANDARD_DAYS: [number, number] = [3, 5];
const EXPRESS_DAYS: [number, number] = [1, 2];

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++; // skip Sun/Sat
  }

  return result;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export async function GET(req: Request, { params }: RouteParams) {
  const { pincode } = await params;

  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid 6-digit pincode." },
      { status: 400 }
    );
  }

  const result = await checkPincodeServiceability(pincode);

  if (!result.serviceable) {
    return NextResponse.json({
      success: true,
      serviceable: false,
      message:
        result.message ||
        "We don't currently deliver to this pincode.",
    });
  }

  const now = new Date();

  const standardFrom = addBusinessDays(now, STANDARD_DAYS[0]);
  const standardTo = addBusinessDays(now, STANDARD_DAYS[1]);
  const expressFrom = addBusinessDays(now, EXPRESS_DAYS[0]);
  const expressTo = addBusinessDays(now, EXPRESS_DAYS[1]);

  return NextResponse.json({
    success: true,
    serviceable: true,
    codAvailable: result.codAvailable,
    standard: {
      from: formatDate(standardFrom),
      to: formatDate(standardTo),
    },
    express: {
      from: formatDate(expressFrom),
      to: formatDate(expressTo),
    },
  });
}
