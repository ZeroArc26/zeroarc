import { Gem, RotateCcw, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Gem,
    title: "Premium Quality",
    subtitle: "Finest Fabric",
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

export default function ProductFeatures() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 p-5 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-black">{title}</p>
            <p className="text-xs text-zinc-500">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}