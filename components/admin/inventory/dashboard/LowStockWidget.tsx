import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { VariantInventoryRow } from "@/lib/actions/inventory/getProductVariantInventory";

interface Props {
  rows: VariantInventoryRow[];
}

export default function LowStockWidget({ rows }: Props) {
  const lowStockRows = rows
    .filter((r) => r.stock <= r.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {lowStockRows.map((row) => (
          <div
            key={`${row.productId}-${row.variantId}`}
            className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              {row.productImage ? (
                <Image
                  src={row.productImage}
                  alt={row.productTitle}
                  width={60}
                  height={60}
                  className="rounded-lg border object-cover"
                />
              ) : (
                <div className="h-[60px] w-[60px] rounded-lg border bg-muted" />
              )}

              <div>
                <h3 className="font-semibold">{row.productTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {row.color} • {row.size}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      row.stock === 0
                        ? "border-red-500 text-red-600"
                        : "border-yellow-500 text-yellow-600"
                    }
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {row.stock === 0 ? "Out of Stock" : `${row.stock} Left`}
                  </Badge>
                </div>
              </div>
            </div>

            <Link href="/admin/dashboard/inventory/all">
              <Button size="sm">Adjust Stock</Button>
            </Link>
          </div>
        ))}

        {lowStockRows.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">No Low Stock Products</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything is sufficiently stocked.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}