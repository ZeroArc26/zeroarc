"use client";

import { useEffect, useState } from "react";

import Reveal from "@/components/motion/Reveal";
import { DURATION } from "@/components/motion/config";

export default function AnnouncementBar() {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(599);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.shipping?.freeShippingThreshold != null) {
          setFreeShippingThreshold(data.shipping.freeShippingThreshold);
        }
      })
      .catch(() => {
        // silently keep the fallback value above
      });
  }, []);

  return (
    <Reveal
      trigger="mount"
      y={6}
      duration={DURATION.ui}
      className="flex h-10 items-center justify-center bg-black text-xs font-semibold uppercase tracking-widest text-violet-400"
    >
      ⚡ FREE SHIPPING ON PREPAID ORDERS ABOVE ₹{freeShippingThreshold}
    </Reveal>
  );
}
