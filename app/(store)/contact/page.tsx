"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Sparkles,
  User,
  Mail,
  MessageSquare,
  Pencil,
  ArrowRight,
  MapPin,
  Crown,
  Truck,
  ShieldCheck,
  Headset,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6.1L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
    </svg>
  );
}

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@zeroarc.in", "We reply within 24 hours"],
  },
  {
    icon: MapPin,
    title: "Our Location",
    lines: ["Kolkata, India", "Serving Anime Fans Worldwide"],
  },
  {
    icon: null,
    title: "Follow Us",
    lines: ["@zeroarc.in", "Stay Connected"],
    social: true,
  },
];

const FEATURES = [
  { icon: Crown, title: "Premium Quality", subtitle: "Finest Fabric, Superior Comfort" },
  { icon: Truck, title: "Fast Delivery", subtitle: "Quick & Reliable Shipping" },
  { icon: ShieldCheck, title: "Secure Payments", subtitle: "100% Safe & Trusted" },
  { icon: Headset, title: "Support 24/7", subtitle: "We're Always Here For You" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // TODO (before launch): wire this up to a real /api/contact route
    // that emails or stores the message.
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-6 top-16 hidden text-4xl font-black leading-[1.15] tracking-[0.3em] text-zinc-100 [writing-mode:vertical-rl] md:block">
          次の物語を、着よう
        </div>

        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 text-3xl font-black tracking-[0.3em] text-zinc-100 [writing-mode:vertical-rl] lg:block">
          ZEROARC
        </div>

        <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-6 py-16 md:px-14 lg:grid-cols-2">
          <div>
            <p className="text-lg tracking-[0.2em] text-violet-600">
              つながる、未来をつくる。
            </p>

            <h1 className="mt-4 font-[family:var(--font-space)] text-6xl font-black uppercase leading-[0.95] text-black md:text-7xl">
              Contact
              <br />
              <span className="text-violet-600">Us</span>
            </h1>

            <div className="mt-5 h-1 w-16 bg-violet-600" />

            <h2 className="mt-6 text-xl font-black uppercase leading-snug text-black md:text-2xl">
              We&apos;re Here For You.
              <br />
              Always.
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-zinc-600">
              Got a question, need help with an order, or just want to say
              hello? We&apos;d love to hear from you. Our team is always
              ready to help.
            </p>
          </div>

          <div className="relative mx-auto h-[680px] w-full max-w-2xl">
            <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-violet-200 via-violet-100 to-transparent blur-2xl" />
            <Image
              src="/images/contact/female-banner.png"
              alt="ZeroArc model"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="border-t border-zinc-200 bg-white px-6 py-16 md:px-14">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Send us a message */}
          <div className="rounded-2xl border border-zinc-200 p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black uppercase text-black">
              Send Us A Message
              <Sparkles className="h-4 w-4 text-violet-600" />
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-zinc-300 py-3.5 pl-11 pr-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your Email"
                  className="w-full rounded-xl border border-zinc-300 py-3.5 pl-11 pr-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                />
              </div>

              <div className="relative">
                <MessageSquare className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-zinc-300 py-3.5 pl-11 pr-4 text-sm text-black outline-none focus:border-violet-500"
                >
                  <option value="">Subject</option>
                  <option value="order">Order Support</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="relative">
                <Pencil className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-zinc-400" />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Your Message"
                  className="w-full rounded-xl border border-zinc-300 py-3.5 pl-11 pr-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Send Message
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Get in touch */}
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black uppercase text-black">
              Get In Touch
              <Sparkles className="h-4 w-4 text-violet-600" />
            </h2>

            <div className="space-y-6">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    {item.social ? <InstagramIcon /> : item.icon && <item.icon className="h-5 w-5" />}
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-black">
                      {item.title}
                    </p>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-zinc-500">
                        {line}
                      </p>
                    ))}

                    {item.social && (
                      <div className="mt-2 flex gap-3 text-zinc-500">
                        <a href="https://instagram.com/zeroarc.in" target="_blank" rel="noreferrer" className="transition hover:text-violet-600">
                          <InstagramIcon />
                        </a>
                        <a href="https://x.com/zeroarc_in" target="_blank" rel="noreferrer" className="transition hover:text-violet-600">
                          <XIcon />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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