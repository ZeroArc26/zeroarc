import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Truck,
  History,
  ShieldCheck,
  MapPin,
  Building2,
  Landmark,
  Home,
  Info,
  ShoppingBag,
  Package,
  CheckCircle2,
  Headset,
  ArrowRight,
  FileText,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const STATS = [
  { icon: Truck, title: "Pan India Shipping", subtitle: "We ship across India to 25000+ pincodes" },
  { icon: History, title: "Fast & Reliable", subtitle: "Timely delivery with our trusted partners" },
  { icon: ShieldCheck, title: "Safe & Secure", subtitle: "Your order is packed with extra care" },
  { icon: MapPin, title: "Real-time Tracking", subtitle: "Track your order every step of the way" },
];

const ZONES = [
  {
    icon: Building2,
    title: "Metro Cities",
    body: "Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata and more.",
    time: "2 - 4 Business Days",
  },
  {
    icon: Landmark,
    title: "Major Cities",
    body: "Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Coimbatore and more.",
    time: "3 - 5 Business Days",
  },
  {
    icon: Home,
    title: "Other Cities",
    body: "All other city locations in India.",
    time: "4 - 6 Business Days",
  },
  {
    icon: MapPin,
    title: "Remote Areas",
    body: "Remote areas and hill stations may take a little extra time.",
    time: "5 - 7 Business Days",
  },
];

const STEPS = [
  { icon: ShoppingBag, title: "Order Placed", body: "You place your order on ZeroArc." },
  { icon: Package, title: "Order Confirmed", body: "We confirm your order and prepare it." },
  { icon: Truck, title: "Order Shipped", body: "Your order is picked up by our shipping partner." },
  { icon: MapPin, title: "Out for Delivery", body: "Your order is on the way to your address." },
  { icon: CheckCircle2, title: "Delivered", body: "Your order is delivered safely to you!" },
];

const PARTNERS = ["Delhivery", "Blue Dart", "Ekart", "XpressBees", "India Post"];

const IMPORTANT_INFO = [
  "Orders are not shipped or delivered on Sundays and public holidays.",
  "Once your order is shipped, you will receive a tracking link via email/SMS.",
  "If your order is delayed, please allow extra time or contact our support team.",
  "Shipping charges (if any) will be shown at checkout.",
];

export default function ShippingPage() {
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
            <span className="font-semibold text-violet-600">Shipping</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-[1fr_420px]">
            <div>
              <h1 className="text-4xl font-black text-black md:text-5xl">
                Shipping Information
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-zinc-600">
                We deliver your favorite anime streetwear safely and on
                time, right to your doorstep. Here&apos;s everything you
                need to know about our shipping.
              </p>
            </div>

            <div className="relative mx-auto aspect-[3/2] w-full max-w-md">
              <Image
                src="/images/shipping/male-model.png"
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
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 rounded-2xl border border-zinc-200 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-start gap-3">
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

      {/* Shipping Zones & Delivery Time */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                Shipping Zones &amp; Delivery Time
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                We process and ship orders from our warehouse as fast as
                possible.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ZONES.map(({ icon: Icon, title, body, time }) => (
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
                <span className="mt-4 inline-block rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                  {time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-violet-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
            <p className="text-sm text-zinc-700">
              <span className="font-semibold">Note:</span> Delivery times
              may vary based on your location, product availability and
              current demand.
            </p>
          </div>
        </div>
      </section>

      {/* How Shipping Works */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                How Shipping Works
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                From place to your doorstep, we keep it smooth and simple.
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

      {/* Our Shipping Partners */}
      <section className="px-6 pb-10 md:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">
                Our Shipping Partners
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                We work with trusted logistics partners to ensure your
                order reaches you safely.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="flex h-16 items-center justify-center rounded-2xl border border-zinc-200 px-4"
              >
                <span className="text-sm font-bold text-zinc-700">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information + Need Help */}
      <section className="px-6 pb-16 md:px-14">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-black">
              <FileText className="h-4 w-4 text-violet-600" />
              Important Information
            </h2>

            <div className="space-y-3">
              {IMPORTANT_INFO.map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <p className="text-sm text-zinc-600">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-fit flex-col gap-3 rounded-2xl bg-violet-50 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white">
              <Headset className="h-5 w-5" />
            </div>
            <p className="font-bold text-black">Need Help?</p>
            <p className="text-sm text-zinc-600">
              If you have any questions about shipping, feel free to
              contact our support team.
            </p>
            <Link
              href="/contact"
              className="mt-2 flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}