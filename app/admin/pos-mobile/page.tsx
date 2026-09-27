import { redirect } from "next/navigation";
import type { Metadata, Viewport } from "next";

import { getCurrentAdmin } from "@/lib/auth/admin";
import MobilePOS from "@/components/admin/pos/MobilePOS";

export const metadata: Metadata = {
  title: "ZeroArc POS",
  description: "Scan a barcode, complete a sale, print the invoice — from your phone.",
  manifest: "/pos-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZeroArc POS",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function POSMobilePage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login?next=/admin/pos-mobile");
  }

  return <MobilePOS adminName={admin.name} />;
}
