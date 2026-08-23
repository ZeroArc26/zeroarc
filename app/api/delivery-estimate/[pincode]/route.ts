import { NextResponse } from "next/server";

import { checkPincodeServiceability } from "@/lib/delhivery";
import { getStoreSettings } from "@/lib/settings";

interface RouteParams {
  params: Promise<{ pincode: string }>;
}

// Base windows for a NEARBY delivery (same city as the warehouse).
// Delhivery's basic pincode-serviceability API only confirms whether a
// pincode is serviceable — it doesn't return real per-pincode transit
// time (that needs a higher API tier). So distance is approximated
// using India's postal zone system (first digit of the pincode) —
// same zone as the warehouse ships fastest, other zones add days,
// and known remote zones (NE states, J&K/Ladakh, Andaman) add more.
const BASE_STANDARD_DAYS: [number, number] = [2, 3];
const BASE_EXPRESS_DAYS: [number, number] = [1, 1];

// Pincode prefixes that are genuinely remote / slower to reach.
const REMOTE_PREFIXES = ["79", "78", "18", "19", "744"]; // NE states, J&K/Ladakh, Andaman

function getZoneExtraDays(storePincode: string, customerPincode: string): number {
  if (!storePincode || storePincode.length < 3) return 1; // unknown warehouse pincode, assume +1 as a safe default

  const isRemote = REMOTE_PREFIXES.some((p) => customerPincode.startsWith(p));
  if (isRemote) return 4;

  const sameCity = customerPincode.slice(0, 3) === storePincode.slice(0, 3);
  if (sameCity) return 0;

  const sameZone = customerPincode[0] === storePincode[0];
  if (sameZone) return 1;

  return 2; // different postal zone entirely
}

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

  const settings = await getStoreSettings();
  const storePincode = settings.address?.pincode || "";
  const extraDays = getZoneExtraDays(storePincode, pincode);

  // Best-effort city/state lookup (same India Post API the checkout
  // pincode auto-fill already uses) — purely cosmetic, never blocks
  // the serviceability/estimate result if it fails.
  let city: string | null = null;
  let state: string | null = null;
  try {
    const postRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const postData = await postRes.json();
    const postOffice = postData?.[0]?.PostOffice?.[0];
    if (postData?.[0]?.Status === "Success" && postOffice) {
      city = postOffice.District;
      state = postOffice.State;
    }
  } catch {
    // silently ignore — city/state are optional extras
  }

  const standardDays: [number, number] = [
    BASE_STANDARD_DAYS[0] + extraDays,
    BASE_STANDARD_DAYS[1] + extraDays,
  ];
  const expressDays: [number, number] = [
    BASE_EXPRESS_DAYS[0] + Math.min(extraDays, 2), // express caps how much distance can slow it down
    BASE_EXPRESS_DAYS[1] + Math.min(extraDays, 2),
  ];

  const now = new Date();

  const standardFrom = addBusinessDays(now, standardDays[0]);
  const standardTo = addBusinessDays(now, standardDays[1]);
  const expressFrom = addBusinessDays(now, expressDays[0]);
  const expressTo = addBusinessDays(now, expressDays[1]);

  return NextResponse.json({
    success: true,
    serviceable: true,
    codAvailable: result.codAvailable,
    city,
    state,
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

