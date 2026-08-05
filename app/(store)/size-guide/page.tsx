"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Ruler,
  Info,
  Layers,
  Mail,
  Headset,
  Sparkles,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

const SIZE_CHART = [
  { size: "XS", chest: 36, length: 26, shoulder: 16, sleeve: 7.5, weight: "45-55 kg" },
  { size: "S", chest: 38, length: 27, shoulder: 17, sleeve: 8, weight: "55-65 kg" },
  { size: "M", chest: 40, length: 28, shoulder: 18, sleeve: 8.5, weight: "65-75 kg" },
  { size: "L", chest: 42, length: 29, shoulder: 19, sleeve: 9, weight: "75-85 kg" },
  { size: "XL", chest: 44, length: 30, shoulder: 20, sleeve: 9.5, weight: "85-95 kg" },
  { size: "XXL", chest: 46, length: 31, shoulder: 21, sleeve: 10, weight: "95-110 kg" },
  { size: "XXXL", chest: 48, length: 32, shoulder: 22, sleeve: 10.5, weight: "110-125 kg" },
];

// Midpoint of each size's weight band, used for nearest-match calculation.
const WEIGHT_MIDPOINTS = [50, 60, 70, 80, 90, 102.5, 117.5];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const MEASURE_STEPS = [
  {
    step: 1,
    title: "Chest",
    image: "/images/size/chest.png",
    body: "Measure around the fullest part of your chest, keeping the tape horizontal.",
  },
  {
    step: 2,
    title: "Length",
    image: "/images/size/length.png",
    body: "Measure from the highest point of the shoulder to the bottom hem.",
  },
  {
    step: 3,
    title: "Shoulder",
    image: "/images/size/shoulder.png",
    body: "Measure from one shoulder tip to the other across the back.",
  },
  {
    step: 4,
    title: "Sleeve Length",
    image: "/images/size/sleeve-length.png",
    body: "Measure from the shoulder seam to the end of the sleeve.",
  },
];

const FIT_GUIDE = [
  {
    title: "Oversized Fit",
    image: "/images/size/oversize-fit.png",
    body: "Relaxed and baggy fit for a streetwear look. Size up for extra loose fit.",
  },
  {
    title: "Regular Fit",
    image: "/images/size/regular-fit.png",
    body: "Comfortable and classic fit. True to size for everyday wear.",
  },
  {
    title: "Slim Fit",
    image: "/images/size/slim-fit.png",
    body: "Tailored fit that sits closer to the body. Size down for a fitted look.",
  },
];

const SIZE_FAQS = [
  {
    q: "Which size should I choose?",
    a: "Use our Size Chart and Size Calculator above based on your chest measurement or weight. If you're between two sizes, we recommend sizing up for a relaxed fit.",
  },
  {
    q: "Will the t-shirts shrink after wash?",
    a: "Our fabric is pre-shrunk, so shrinkage is minimal (less than 3%) when washed as per the care instructions on the label.",
  },
  {
    q: "What if I'm between two sizes?",
    a: "We recommend sizing up if you prefer a relaxed, oversized look, or sizing down if you prefer a more fitted silhouette.",
  },
  {
    q: "Are the sizes unisex?",
    a: "Yes, our sizing is unisex and designed to work well across different body types with an oversized silhouette.",
  },
  {
    q: "What if the size doesn't fit me?",
    a: "No worries! You can request an exchange or return within 7 days of delivery. Check our Returns & Refunds page for details.",
  },
];

const HEIGHTS = [
  "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"",
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"",
  "6'2\"", "6'3\"", "6'4\"", "6'5\"",
];

const WEIGHTS = Array.from({ length: 19 }, (_, i) => 40 + i * 5); // 40 to 130

const FIT_PREFERENCES = ["Oversized", "Regular", "Slim"];

function heightToInches(height: string) {
  const match = height.match(/(\d+)'(\d+)"/);
  if (!match) return 67;
  return parseInt(match[1]) * 12 + parseInt(match[2]);
}

export default function SizeGuidePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitPref, setFitPref] = useState("Oversized");
  const [result, setResult] = useState<string | null>(null);

  function calculateSize(h: string, w: string, fit: string) {
    if (!h || !w) return null;

    const weightNum = parseInt(w);
    const heightIn = heightToInches(h);

    // Nearest weight-midpoint match
    let closestIndex = 0;
    let smallestDiff = Infinity;
    WEIGHT_MIDPOINTS.forEach((mid, i) => {
      const diff = Math.abs(weightNum - mid);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = i;
      }
    });

    // Height nudge only when weight sits near a band boundary
    const lowerMid = WEIGHT_MIDPOINTS[closestIndex - 1];
    const upperMid = WEIGHT_MIDPOINTS[closestIndex + 1];

    if (upperMid !== undefined && weightNum > (WEIGHT_MIDPOINTS[closestIndex] + upperMid) / 2 - 3) {
      if (heightIn >= 70) closestIndex = Math.min(closestIndex + 1, SIZES.length - 1);
    } else if (lowerMid !== undefined && weightNum < (WEIGHT_MIDPOINTS[closestIndex] + lowerMid) / 2 + 3) {
      if (heightIn <= 63) closestIndex = Math.max(closestIndex - 1, 0);
    }

    // Fit preference adjustment (garments run oversized by default)
    if (fit === "Regular") closestIndex -= 1;
    if (fit === "Slim") closestIndex -= 2;

    closestIndex = Math.max(0, Math.min(closestIndex, SIZES.length - 1));

    return SIZES[closestIndex];
  }

  useEffect(() => {
    setResult(calculateSize(height, weight, fitPref));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, weight, fitPref]);

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1500px] px-6 pt-8 md:px-14">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-violet-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/faq" className="transition hover:text-violet-600">
            Help Center
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-violet-600">Size Guide</span>
        </nav>

        {/* Header */}
        <div className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Ruler className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black text-black md:text-4xl">
                Size Guide
              </h1>
            </div>
            <p className="max-w-xl leading-relaxed text-zinc-600">
              Find your perfect fit before placing your order. Use our
              size chart and measuring guide to choose the right size for
              you.
            </p>
          </div>

          <div className="relative mx-auto h-[340px] w-full max-w-xs">
            <Image
              src="/images/size/male-model.png"
              alt="ZeroArc model"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Size Chart */}
        <div className="mb-10 rounded-2xl border border-zinc-200 p-6">
          <h2 className="mb-5 flex items-center gap-2 font-bold text-black">
            <Layers className="h-4 w-4 text-violet-600" />
            Size Chart (In Inches)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-violet-50 text-left">
                  <th className="px-4 py-3 font-bold text-black">Size</th>
                  <th className="px-4 py-3 font-bold text-black">Chest (in)</th>
                  <th className="px-4 py-3 font-bold text-black">Length (in)</th>
                  <th className="px-4 py-3 font-bold text-black">Shoulder (in)</th>
                  <th className="px-4 py-3 font-bold text-black">Sleeve Length (in)</th>
                  <th className="px-4 py-3 font-bold text-black">Recommended Weight</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3 font-bold text-black">{row.size}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.chest}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.length}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.shoulder}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.sleeve}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
            Size may vary by ±0.5-1 inch due to unisex oversized fit and
            manufacturing.
          </div>
        </div>

        {/* How to Measure Yourself */}
        <div className="mb-10 rounded-2xl border border-zinc-200 p-6">
          <h2 className="mb-6 flex items-center gap-2 font-bold text-black">
            <Info className="h-4 w-4 text-violet-600" />
            How to Measure Yourself
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {MEASURE_STEPS.map(({ step, title, image, body }) => (
              <div key={title} className="text-center">
                <div className="relative mx-auto h-28 w-28">
                  <Image src={image} alt={title} fill className="object-contain" />
                  <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold uppercase text-black">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fit Guide + Size Calculator */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Fit Guide */}
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-5 flex items-center gap-2 font-bold text-black">
              <Layers className="h-4 w-4 text-violet-600" />
              Fit Guide
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FIT_GUIDE.map(({ title, image, body }) => (
                <div key={title} className="rounded-xl border border-zinc-200 p-4">
                  <div className="relative mx-auto h-20 w-20">
                    <Image src={image} alt={title} fill className="object-contain" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-violet-600">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
              If you&apos;re between sizes, we recommend sizing up for a
              relaxed fit.
            </div>
          </div>

          {/* Size Calculator */}
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-5 flex items-center gap-2 font-bold text-black">
              <Sparkles className="h-4 w-4 text-violet-600" />
              Size Calculator
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                  Height
                </label>
                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none focus:border-violet-500"
                >
                  <option value="">Select your height</option>
                  {HEIGHTS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                  Weight
                </label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none focus:border-violet-500"
                >
                  <option value="">Select your weight</option>
                  {WEIGHTS.map((w) => (
                    <option key={w} value={w}>{w} kg</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                  Fit Preference
                </label>
                <select
                  value={fitPref}
                  onChange={(e) => setFitPref(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none focus:border-violet-500"
                >
                  {FIT_PREFERENCES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setResult(calculateSize(height, weight, fitPref))}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Recommend My Size
                <Sparkles className="h-4 w-4" />
              </button>

              {result && (
                <div className="rounded-xl bg-violet-50 p-4 text-center">
                  <p className="text-xs text-zinc-500">Recommended Size</p>
                  <p className="text-2xl font-black text-violet-600">
                    {result}
                  </p>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-zinc-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
                Our calculator gives an approximate size recommendation.
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide FAQs + Still Need Help */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-black">
              <Layers className="h-4 w-4 text-violet-600" />
              Size Guide FAQs
            </h2>

            <div>
              {SIZE_FAQS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={item.q} className="border-b border-zinc-100 last:border-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className={`text-sm font-semibold ${isOpen ? "text-violet-600" : "text-black"}`}>
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-4 text-sm leading-relaxed text-zinc-600">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-violet-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white">
                <Headset className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-black">Still Need Help?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Our support team is here to help you find your perfect
                size.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Contact Us
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                <div>
                  <p className="text-sm font-bold text-black">Email Us</p>
                  <p className="text-xs text-zinc-500">support@zeroarc.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}