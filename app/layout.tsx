import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "sonner";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "ZeroArc | Wear Your Next Story",
  description: "Premium Anime Streetwear Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
  className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
>
  <Navbar />

  <Toaster
  richColors
  position="top-right"
  theme="dark"
/>

  {children}
  <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="beforeInteractive"
/>
</body>
    </html>
  );
}