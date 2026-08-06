"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { VariantInventoryRow } from "@/lib/actions/inventory/getProductVariantInventory";
import EditVariantStockDialog from "../dialogs/EditVariantStockDialog";

interface InventoryTableProps {
  rows: VariantInventoryRow[];
}

export default function InventoryTable({ rows }: InventoryTableProps) {
  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Low Stock At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No inventory found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={`${row.productId}-${row.variantId}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {row.productImage ? (
                      <Image
                        src={row.productImage}
                        alt={row.productTitle}
                        width={40}
                        height={40}
                        className="rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg border bg-muted" />
                    )}
                    <span>{row.productTitle}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {row.color} • {row.size}
                </TableCell>

                <TableCell className="font-mono text-xs">{row.sku}</TableCell>

                <TableCell>{row.stock}</TableCell>

                <TableCell>{row.lowStockThreshold}</TableCell>

                <TableCell>
                  {row.stock === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : row.stock <= row.lowStockThreshold ? (
                    <Badge variant="secondary">Low Stock</Badge>
                  ) : (
                    <Badge>In Stock</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <EditVariantStockDialog row={row} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}