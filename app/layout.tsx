import type { Metadata } from "next";
import { Inter, Space_Grotesk, Anton } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${anton.variable} antialiased`}
      >
        <Toaster
          richColors
          position="top-right"
          theme="dark"
        />

        {children}
      </body>
    </html>
  );
}