import Reveal from "@/components/motion/Reveal";
import { DURATION } from "@/components/motion/config";

export default function AnnouncementBar() {
  return (
    <Reveal
      trigger="mount"
      y={6}
      duration={DURATION.ui}
      className="flex h-10 items-center justify-center bg-black text-xs font-semibold uppercase tracking-widest text-violet-400"
    >
      ⚡ FREE SHIPPING ON PREPAID ORDERS ABOVE ₹999
    </Reveal>
  );
}
