import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  RotateCcw,
  Package,
  CreditCard,
  ShieldCheck,
  ClipboardCheck,
  Tag,
  Shirt,
  FileText,
  Info,
  RefreshCw,
  User,
  Truck,
  PackageCheck,
  Clock,
  Headset,
  ArrowRight,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const STATS = [
  { icon: RotateCcw, title: "7 Days", subtitle: "Return Window" },
  { icon: Package, title: "Easy Returns", subtitle: "Hassle-free process" },
  { icon: CreditCard, title: "Refund to Original", subtitle: "Payment Method" },
  { icon: ShieldCheck, title: "Safe & Secure", subtitle: "100% Protection" },
];

const ELIGIBILITY = [
  {
    icon: Tag,
    title: "Within 7 Days",
    body: "Return requests must be raised within 7 days of delivery.",
  },
  {
    icon: Shirt,
    title: "Unused & Unworn",
    body: "Items must be unused, unworn, unwashed, and in original condition.",
  },
  {
    icon: Package,
    title: "Original Packaging",
    body: "Product must be returned in original packaging with all tags intact.",
  },
  {
    icon: FileText,
    title: "Proof of Purchase",
    body: "A valid order ID or proof of purchase is required for returns.",
  },
];

const STEPS = [
  { icon: User, title: "Login to your account", body: "Go to 'My Orders' section." },
  { icon: Package, title: "Select Order", body: "Choose the order you want to return." },
  { icon: RotateCcw, title: "Request Return", body: "Click on 'Request Return' and select the reason." },
  { icon: Truck, title: "Pickup / Shipping", body: "We will pickup the item or provide shipping instructions." },
  { icon: PackageCheck, title: "Refund Processed", body: "Once the item is inspected, your refund will be processed." },
];

const REFUND_INFO = [
  { icon: Clock, title: "Refund Timeline", body: "Refunds are processed within 5-7 business days." },
  { icon: CreditCard, title: "Refund Method", body: "Amount will be refunded to the original payment method." },
  { icon: FileText, title: "Partial Refunds", body: "Shipping charges (if any) are non-refundable." },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      {/* Header */}
      <section className="px-6 pt-8 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition hover:text-violet-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-violet-600">Returns</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-[1fr_320px]">
            <div>
              <h1 className="text-4xl font-black text-black md:text-5xl">
                Returns &amp; Refunds
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-zinc-600">
                Not satisfied with your purchase? No worries. We offer easy
                returns and hassle-free refunds to make your experience
                better.
              </p>
            </div>

            <div className="relative mx-auto h-[340px] w-full max-w-xs">
              <Image
                src="/images/returns/male-model.png"
                alt="ZeroArc model"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-6 rounded-2xl border border-zinc-200 p-6 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{title}</p>
                <p className="text-xs text-zinc-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Return Eligibility */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                Return Eligibility
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                To be eligible for return, please make sure that:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ELIGIBILITY.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-black">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-violet-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
            <p className="text-sm text-zinc-700">
              <span className="font-semibold">Note:</span> Innerwear,
              accessories, customized products and sale items are not
              eligible for return.
            </p>
          </div>
        </div>
      </section>

      {/* How to Initiate a Return */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                How to Initiate a Return
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Follow these simple steps to return your order:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <span className="absolute right-[-16px] top-9 hidden h-px w-8 bg-zinc-200 lg:block" />
                )}

                <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {i + 1}
                </div>

                <div className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-black">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                Refund Information
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Once we receive and inspect your returned item:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {REFUND_INFO.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help? */}
      <section className="px-6 pb-16 md:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-4 rounded-2xl bg-violet-50 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <Headset className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-black">Need Help?</p>
              <p className="text-sm text-zinc-600">
                Our support team is here to assist you with any return
                related queries.
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