import { Gem, Truck, RotateCcw, ShieldCheck } from "lucide-react";

import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const FEATURES = [
  {
    icon: Gem,
    title: "Premium Quality",
    subtitle: "Finest Fabric, Superior Comfort",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Quick & Reliable Shipping",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "Hassle-free Returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% Safe & Secure",
  },
];

export default function FeaturesBar() {
  return (
    <section className="border-y border-zinc-200 bg-white px-6 py-10 md:px-14">
      <StaggerGroup gap={0.03} className="mx-auto grid max-w-[1700px] grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-zinc-200">
        {FEATURES.map(({ icon: Icon, title, subtitle }) => (
          <StaggerItem
            key={title}
            y={8}
            duration={0.35}
            className="flex items-center gap-4 md:pl-8 md:first:pl-0"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition-transform duration-300 hover:scale-110">
              <Icon className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-black">
                {title}
              </p>
              <p className="text-xs text-zinc-500">{subtitle}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
