"use client";

import { useState } from "react";
import { Store, MapPin, Receipt, Truck, Bell, Share2 } from "lucide-react";

import StoreInfoSection from "./StoreInfoSection";
import AddressSection from "./AddressSection";
import TaxSection from "./TaxSection";
import ShippingSection from "./ShippingSection";
import NotificationsSection from "./NotificationsSection";
import SocialSeoSection from "./SocialSeoSection";

const TABS = [
  { key: "store", label: "Store Info", icon: Store },
  { key: "address", label: "Address", icon: MapPin },
  { key: "tax", label: "Tax", icon: Receipt },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "social", label: "Social & SEO", icon: Share2 },
] as const;

export default function SettingsTabs({ settings }: { settings: any }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("store");

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="space-y-1 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-3">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              active === key
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div>
        {active === "store" && <StoreInfoSection initial={settings.store} />}
        {active === "address" && <AddressSection initial={settings.address} />}
        {active === "tax" && <TaxSection initial={settings.tax} />}
        {active === "shipping" && <ShippingSection initial={settings.shipping} />}
        {active === "notifications" && (
          <NotificationsSection initial={settings.notifications} />
        )}
        {active === "social" && (
          <SocialSeoSection
            initialSocial={settings.social}
            initialSeo={settings.seo}
          />
        )}
      </div>
    </div>
  );
}