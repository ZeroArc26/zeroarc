import Image from "next/image";
import {
  Crosshair,
  Eye,
  Gem,
  Users,
  Shirt,
  Globe,
  Star,
  Zap,
  Crown,
  Truck,
  ShieldCheck,
  Headset,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const VALUES = [
  {
    icon: Crosshair,
    title: "Our Mission",
    description:
      "To empower dreamers and rebels to express their story through premium anime inspired streetwear.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become the most trusted anime streetwear brand worldwide, loved by a community that lives fearlessly and dreams bigger.",
  },
  {
    icon: Gem,
    title: "Our Promise",
    description:
      "Premium quality, original designs and limited drops that make every piece as unique as your story.",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "We are a community of dreamers, creators and believers who know that every ending is a new arc.",
  },
];

const FEATURES = [
  { icon: Crown, title: "Premium Quality", subtitle: "Finest Fabric, Superior Comfort" },
  { icon: Truck, title: "Fast Delivery", subtitle: "Quick & Reliable Shipping" },
  { icon: ShieldCheck, title: "Secure Payments", subtitle: "100% Safe & Trusted" },
  { icon: Headset, title: "Support 24/7", subtitle: "We're Always Here For You" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-10 top-10 hidden text-[220px] font-black leading-none text-zinc-100 md:block">
          次
        </div>

        <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-6 py-16 md:px-14 lg:grid-cols-2">
          <div>
            <p className="text-lg tracking-[0.2em] text-violet-600">
              次の物語を、着よう
            </p>

            <h1 className="mt-4 font-[family:var(--font-space)] text-6xl font-black uppercase leading-[0.95] text-black md:text-7xl">
              About
              <br />
              <span className="text-violet-600">Us</span>
            </h1>

            <div className="mt-5 h-1 w-16 bg-violet-600" />

            <h2 className="mt-6 text-xl font-black uppercase leading-snug text-black md:text-2xl">
              We Don&apos;t Sell T-Shirts.
              <br />
              We Sell Your Next Arc.
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-zinc-600">
              ZeroArc is more than a brand — it&apos;s a universe for
              dreamers, rebels and story-livers. Every design is inspired by
              anime, culture and the countless emotions that shape our
              journeys. We create premium streetwear that lets you wear your
              next story with pride.
            </p>
          </div>

          <div className="relative mx-auto h-[640px] w-full max-w-xl">
  <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-violet-200 via-violet-100 to-transparent blur-2xl" />
  <Image
    src="/images/about/male-banner.png"
    alt="ZeroArc model"
    fill
    priority
    className="object-contain"
  />
</div>
        </div>
      </section>

      {/* Mission / Vision / Promise / Community */}
      <section className="border-t border-zinc-200 bg-white px-6 py-16 md:px-14">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-black">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-zinc-200 bg-white px-6 py-10 md:px-14">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-8 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-black">
                  {title}
                </p>
                <p className="text-xs text-zinc-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}