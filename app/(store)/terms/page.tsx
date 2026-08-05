import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Copyright,
  AlertTriangle,
  Pencil,
  Scale,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    icon: FileText,
    title: "1. General Information",
    body: "By accessing this website and placing an order, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use our website.",
  },
  {
    icon: ShoppingBag,
    title: "2. Products & Pricing",
    body: "All products are subject to availability. We reserve the right to modify prices, descriptions, or discontinue any product without prior notice. Prices are listed in INR and include applicable taxes unless stated otherwise.",
  },
  {
    icon: ShoppingCart,
    title: "3. Orders & Payments",
    body: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Payments must be made in full at the time of placing an order.",
  },
  {
    icon: Truck,
    title: "4. Shipping & Delivery",
    body: "We aim to process and dispatch orders within the time mentioned on the product page. Delivery times may vary based on your location and courier services. ZeroArc is not responsible for delays caused by couriers or unforeseen events.",
  },
  {
    icon: RotateCcw,
    title: "5. Returns & Refunds",
    body: "We offer hassle-free returns within 7 days of delivery. Products must be unused, unwashed, and returned in original packaging with all tags intact. Refunds will be processed to the original payment method.",
    link: { label: "View Return Policy", href: "/returns" },
  },
  {
    icon: ShieldCheck,
    title: "6. User Responsibilities",
    body: "You agree to provide accurate information and not use our website for any unlawful purpose. Any misuse, fraudulent activity, or violation of these terms may result in the termination of your access.",
  },
  {
    icon: Copyright,
    title: "7. Intellectual Property",
    body: "All content on this website including logos, designs, images, text, and graphics are the property of ZeroArc. You may not use, reproduce, or distribute any content without written permission.",
  },
  {
    icon: Scale,
    title: "8. Privacy Policy",
    body: "Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and protect your personal information.",
    link: { label: "Read Privacy Policy", href: "/privacy-policy" },
  },
  {
    icon: AlertTriangle,
    title: "9. Limitation of Liability",
    body: "ZeroArc shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the order amount paid by you.",
  },
  {
    icon: Pencil,
    title: "10. Changes to Terms",
    body: "We reserve the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of the website constitutes acceptance of the updated terms.",
  },
  {
    icon: Scale,
    title: "11. Governing Law",
    body: "These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Delhi, India.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-8 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition hover:text-violet-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-violet-600">
              Terms &amp; Conditions
            </span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-[1fr_320px]">
  <div>
    <h1 className="text-4xl font-black text-black md:text-5xl">
      Terms &amp; Conditions
    </h1>
    <p className="mt-4 max-w-xl leading-relaxed text-zinc-600">
      Please read these terms and conditions carefully before
      using our website and placing an order. By accessing or
      using ZeroArc, you agree to be bound by these terms.
    </p>
  </div>

  <div className="relative mx-auto h-[340px] w-full max-w-xs">
  <Image
    src="/images/terms/male-model.png"
    alt="ZeroArc model"
    fill
    priority
    className="object-contain"
  />
</div>
</div>
        </div>
      </section>

      {/* Sections */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px] rounded-2xl border border-zinc-200 p-8 sm:p-10">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
            {SECTIONS.map(({ icon: Icon, title, body, link }, i) => (
              <div
                key={title}
                className={`flex gap-4 ${
                  i < SECTIONS.length - (SECTIONS.length % 2 === 0 ? 2 : 1)
                    ? "border-b border-zinc-100 pb-8"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-black">{title}</h2>
                  <p className="mt-2 leading-relaxed text-zinc-600">
                    {body}
                  </p>
                  {link && (
                    <Link
                      href={link.href}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline"
                    >
                      {link.label}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Have questions? */}
      <section className="px-6 pb-16 md:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-4 rounded-2xl bg-violet-50 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-black">Have questions?</p>
              <p className="text-sm text-zinc-600">
                If you have any questions about these Terms &amp;
                Conditions, feel free to contact us.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}