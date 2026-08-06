"use client";

import Link from "next/link";
import {
  Truck,
  MapPin,
  CreditCard,
  Star,
  Gift,
  HelpCircle,
} from "lucide-react";

const QUICK_ACTIONS = [
  { icon: Truck, title: "Track Order", subtitle: "Check delivery status", href: "/account/orders" },
  { icon: MapPin, title: "Manage Addresses", subtitle: "Add or edit addresses", href: "/account" },
  { icon: CreditCard, title: "Payment Methods", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: Star, title: "Arc Points", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: Gift, title: "Refer & Earn", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: HelpCircle, title: "Help & Support", subtitle: "Get help anytime", href: "/contact" },
];

export default function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {QUICK_ACTIONS.map(({ icon: Icon, title, subtitle, href, disabled }) => (
        <Link
          key={title}
          href={disabled ? "#" : href}
          onClick={(e) => disabled && e.preventDefault()}
          className={`flex items-start gap-2 rounded-xl p-2 transition ${
            disabled ? "cursor-not-allowed opacity-50" : "hover:bg-zinc-50"
          }`}
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <div>
            <p className="text-sm font-semibold text-black">{title}</p>
            <p className="text-xs text-zinc-500">{subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}