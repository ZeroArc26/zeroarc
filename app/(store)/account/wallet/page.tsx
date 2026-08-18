"use client";

import Link from "next/link";
import { Wallet, Sparkles, CreditCard, Gift, ArrowLeft } from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import Reveal from "@/components/motion/Reveal";

export default function WalletComingSoonPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <AccountSidebar />

          <Reveal trigger="mount">
            <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-20 text-center md:px-16 md:py-28">
              {/* Cinematic glow layers */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
              <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px]" />

              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                  <Wallet className="h-9 w-9 text-violet-400" />
                </div>

                <p className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Coming Soon
                  <Sparkles className="h-3.5 w-3.5" />
                </p>

                <h1 className="mt-4 font-[family:var(--font-space)] text-4xl font-black uppercase leading-tight text-white md:text-6xl">
                  Your <span className="text-violet-500">Wallet</span>
                  <br />
                  Is On Its Way
                </h1>

                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-zinc-400 md:text-base">
                  Saved payment methods, store credit, and refunds — all in
                  one place. We&apos;re building it now.
                </p>

                <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left">
                    <CreditCard className="h-5 w-5 text-violet-400" />
                    <p className="mt-3 text-sm font-bold text-white">
                      Saved Payment Methods
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Faster checkout, next time onward.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left">
                    <Gift className="h-5 w-5 text-violet-400" />
                    <p className="mt-3 text-sm font-bold text-white">
                      Store Credit & Refunds
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Track balances and redeem in a click.
                    </p>
                  </div>
                </div>

                <Link
                  href="/account"
                  className="mt-12 inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-violet-500 hover:text-violet-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Account
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}
