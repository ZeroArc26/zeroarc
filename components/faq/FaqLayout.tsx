"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  CreditCard,
  Truck,
  RotateCcw,
  Shirt,
  User,
  MoreHorizontal,
  ShieldCheck,
  Headset,
  Mail,
  MessageCircle,
  Clock,
  Zap,
  FileText,
  ShoppingCart,
  ClipboardList,
  CheckCircle2,
  Building2,
  Landmark,
  Home,
  MapPin,
  CalendarCheck,
  Tag,
  Package,
  Ruler,
  PencilRuler,
  ShoppingBag,
  UserPlus,
  UserCheck,
} from "lucide-react";

import { FAQ_CATEGORIES, type FaqQuestion } from "@/constants/faq-data";

const CATEGORY_ICONS = {
  LayoutGrid,
  CreditCard,
  Truck,
  RotateCcw,
  Shirt,
  User,
  MoreHorizontal,
} as const;

const STEP_ICONS = {
  ShoppingCart,
  ClipboardList,
  CreditCard,
  CheckCircle2,
  Building2,
  Landmark,
  Home,
  MapPin,
  CalendarCheck,
  Shirt,
  Tag,
  Package,
  Ruler,
  PencilRuler,
  ShoppingBag,
  UserPlus,
  Mail,
  UserCheck,
  ShieldCheck,
  MessageCircle,
  Headset,
  FileText,
} as const;

const TABS = [
  { slug: "", label: "All FAQs", icon: "LayoutGrid" as const, href: "/faq" },
  ...FAQ_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.name,
    icon: c.icon,
    href: `/faq/${c.slug}`,
  })),
];

const POPULAR_ARTICLES = [
  { label: "How to Track Your Order", href: "/account/orders" },
  { label: "Return & Refund Policy", href: "/returns" },
  { label: "Shipping Information", href: "/shipping" },
];

interface FaqLayoutProps {
  activeSlug: string; // "" for All FAQs
  icon: keyof typeof CATEGORY_ICONS;
  title: string;
  subtitle: string;
  questions: FaqQuestion[];
}

export default function FaqLayout({
  activeSlug,
  icon,
  title,
  subtitle,
  questions,
}: FaqLayoutProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const HeaderIcon = CATEGORY_ICONS[icon];

  return (
    <div className="mx-auto max-w-[1500px] px-6 pt-8 md:px-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/faq" className="transition hover:text-violet-600">
          FAQ
        </Link>
        {activeSlug && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-violet-600">{title}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <HeaderIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-black md:text-4xl">
            {title}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">{subtitle}</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-10 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 p-6 sm:grid-cols-4 lg:grid-cols-7">
        {TABS.map((tab) => {
          const TabIcon = CATEGORY_ICONS[tab.icon];
          const isActive = tab.slug === activeSlug;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-600"
                }`}
              >
                <TabIcon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs font-semibold ${
                  isActive ? "text-violet-600" : "text-zinc-700"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="h-[2px] w-8 rounded-full bg-violet-600" />
              )}
              {tab.slug === "" && !activeSlug && (
                <span className="text-[10px] text-zinc-400">
                  View all questions
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-[1fr_320px]">
        {/* Questions */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-violet-600" />
            {questions.length} Questions
          </div>

          <div className="rounded-2xl border border-zinc-200">
            {questions.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  className="border-b border-zinc-100 px-6 last:border-0"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`font-semibold ${
                        isOpen ? "text-violet-600" : "text-black"
                      }`}
                    >
                      {i + 1}. {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-6">
                      <p className="leading-relaxed text-zinc-600">
                        {item.a}
                      </p>

                      {item.steps && (
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {item.steps.map((step, si) => {
                            const StepIcon = STEP_ICONS[step.icon];
                            return (
                              <div key={step.label} className="relative text-center">
                                {si < item.steps!.length - 1 && (
                                  <span className="absolute right-[-8px] top-6 hidden h-px w-4 bg-zinc-200 sm:block" />
                                )}
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                  <StepIcon className="h-5 w-5" />
                                </div>
                                <p className="mt-2 text-xs font-bold text-black">
                                  {step.label}
                                </p>
                                {step.sub && (
                                  <p className="text-[11px] text-zinc-500">
                                    {step.sub}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-violet-50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white">
              <Headset className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-black">Still Need Help?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Can&apos;t find the answer you&apos;re looking for? Our
              support team is here to assist you.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Contact Us
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div>
                <p className="text-sm font-bold text-black">Email Us</p>
                <p className="text-xs text-zinc-500">support@zeroarc.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div>
                <p className="text-sm font-bold text-black">
                  Support Hours
                </p>
                <p className="text-xs text-zinc-500">
                  Mon - Sat: 10:00 AM - 7:00 PM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div>
                <p className="text-sm font-bold text-black">
                  Response Time
                </p>
                <p className="text-xs text-zinc-500">Within 24 Hours</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-black">
              <FileText className="h-4 w-4 text-violet-600" />
              Popular Articles
            </h3>
            <div className="space-y-3">
              {POPULAR_ARTICLES.map((article) => (
                <Link
                  key={article.label}
                  href={article.href}
                  className="flex items-center justify-between text-sm text-zinc-600 transition hover:text-violet-600"
                >
                  {article.label}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}