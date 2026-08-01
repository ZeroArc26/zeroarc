import { Gem, Truck, RotateCcw, ShieldCheck } from "lucide-react";

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
      <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-8 md:grid-cols-4">
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
  );
}