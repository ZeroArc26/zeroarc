import { Suspense } from "react";
import Image from "next/image";
import { Gem, ShieldCheck, RotateCcw } from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import Reveal from "@/components/motion/Reveal";

const FEATURES = [
  { icon: Gem, title: "Premium Quality", subtitle: "Finest Fabric, Superior Comfort" },
  { icon: ShieldCheck, title: "Secure Shopping", subtitle: "Safe Payments & Data Protection" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle-free Returns Within 7 Days" },
];

export default function LoginPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="bg-white">
        <div className="mx-auto grid max-w-[1700px] items-center gap-10 px-6 py-10 md:px-14 lg:grid-cols-2 lg:py-14">
          {/* Left — editorial image + tagline, desktop only */}
          <Reveal
            trigger="mount"
            className="relative hidden lg:block"
          >
            <div className="pointer-events-none absolute -left-10 top-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />

            <Image
              src="/images/login/male-model.png"
              alt="ZeroArc model wearing the brand's signature streetwear"
              width={1536}
              height={1024}
              priority
              className="relative z-10 h-auto w-full max-w-2xl"
            />

            <p className="relative z-10 mt-4 max-w-sm text-zinc-600">
              Premium anime-inspired streetwear crafted for those who
              live bold and wear their story.
            </p>

            <div className="relative z-10 mt-8 flex gap-8">
              {FEATURES.map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="max-w-[160px] rounded-2xl border border-zinc-200 bg-white p-4"
                >
                  <Icon className="h-6 w-6 text-violet-600" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-black">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right — form */}
          <div className="flex justify-center lg:justify-end">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
