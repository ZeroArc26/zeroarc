import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import DashboardSection from "@/components/admin/shared/DashboardSection";

const lowStockProducts = [
  {
    id: 1,
    name: "ZeroArc Oversized Tee",
    stock: 3,
  },
  {
    id: 2,
    name: "Naruto Hoodie",
    stock: 5,
  },
  {
    id: 3,
    name: "Tokyo Street Tee",
    stock: 7,
  },
  {
    id: 4,
    name: "Samurai Oversized Tee",
    stock: 2,
  },
];

function getBadgeStyle(stock: number) {
  if (stock <= 3) {
    return "bg-red-500/15 text-red-400";
  }

  if (stock <= 5) {
    return "bg-orange-500/15 text-orange-400";
  }

  return "bg-yellow-500/15 text-yellow-400";
}

export default function LowStockProducts() {
  return (
    <DashboardSection
      title="Low Stock Products"
      description="Products that need to be restocked."
      action={
        <Link
          href="/admin/dashboard/products"
          className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          View Inventory
        </Link>
      }
    >
      <div className="space-y-4">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-red-500/30 hover:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>

              <div>
                <h3 className="font-medium text-white">
                  {product.name}
                </h3>

                <p className="text-xs text-zinc-500">
                  Inventory Alert
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getBadgeStyle(
                product.stock
              )}`}
            >
              Only {product.stock} Left
            </span>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}