import Image from "next/image";
import {
  ShieldCheck,
  Database,
  Lock,
  Share2,
  Cookie,
  User,
  FileText,
  Mail,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you place an order or create an account.",
  },
  {
    icon: Database,
    title: "2. How We Use Your Information",
    body: "We use your information to process and deliver your orders, communicate with you, improve our products and services, personalize your experience, and send you updates and promotional offers (if you opt-in).",
  },
  {
    icon: Lock,
    title: "3. How We Protect Your Information",
    body: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    icon: Share2,
    title: "4. Information Sharing",
    body: "We do not sell or rent your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you.",
  },
  {
    icon: Cookie,
    title: "5. Cookies",
    body: "We use cookies to enhance your browsing experience, analyze site traffic and performance, and personalize content. You can manage your cookie preferences in your browser settings.",
  },
  {
    icon: User,
    title: "6. Your Rights",
    body: "You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time.",
  },
  {
    icon: FileText,
    title: "7. Changes To This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.",
  },
  {
    icon: Mail,
    title: "8. Contact Us",
    body: "If you have any questions about this Privacy Policy, please contact us at support@zeroarc.in. We're here to help.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-6 top-16 hidden text-4xl font-black leading-[1.15] tracking-[0.3em] text-zinc-100 [writing-mode:vertical-rl] md:block">
          次の物語を、着よう
        </div>

        <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-6 py-16 md:px-14 lg:grid-cols-2">
          <div>
            <p className="text-lg tracking-[0.2em] text-violet-600">
              あなたのプライバシー、私たちの責任。
            </p>

            <h1 className="mt-4 font-[family:var(--font-space)] text-6xl font-black uppercase leading-[0.95] text-black md:text-7xl">
              Privacy
              <br />
              <span className="text-violet-600">Policy</span>
            </h1>

            <div className="mt-5 h-1 w-16 bg-violet-600" />

            <p className="mt-6 max-w-md leading-relaxed text-zinc-600">
              At ZeroArc, your privacy is important to us. This Privacy
              Policy explains how we collect, use, protect and share your
              information when you visit our website or make a purchase.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-black">
              <ShieldCheck className="h-5 w-5 text-violet-600" />
              Your trust. Our priority.
            </div>
          </div>

          <div className="relative mx-auto h-[680px] w-full max-w-2xl">
            <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-violet-200 via-violet-100 to-transparent blur-2xl" />
            <Image
              src="/images/privacy/female-banner.png"
              alt="ZeroArc model"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Policy sections */}
      <section className="px-6 pb-20 md:px-14">
        <div className="mx-auto max-w-[1100px] rounded-2xl border border-zinc-200 p-8 sm:p-10">
          <div className="space-y-8">
            {SECTIONS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={`flex gap-4 ${
                  i < SECTIONS.length - 1
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}