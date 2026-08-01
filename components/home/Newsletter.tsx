"use client";

import Image from "next/image";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-black px-6 py-14 md:px-14">
      {/* Character illustration */}
      <div className="pointer-events-none absolute -bottom-4 left-0 hidden h-[280px] w-[220px] opacity-90 md:block">
        <Image
          src="/images/newsletter/newsletter-character.png"
          alt=""
          fill
          className="object-contain object-bottom"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-6 md:flex-row md:pl-40">
        <div className="text-center md:text-left">
          <h2 className="font-[family:var(--font-space)] text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
            Join The ZeroArc Community
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Get exclusive drops, offers and updates straight to your inbox.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-md gap-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
          />

          <button
            type="submit"
            className="shrink-0 rounded-xl bg-violet-600 px-7 py-4 text-sm font-semibold tracking-[0.05em] text-white transition hover:bg-violet-500"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}