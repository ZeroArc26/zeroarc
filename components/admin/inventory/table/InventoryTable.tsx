"use client";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Boxes } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InventoryDocument } from "@/lib/types/inventory";

import EditInventoryDialog from "../dialogs/EditInventoryDialog";
import DeleteInventoryDialog from "../dialogs/DeleteInventoryDialog";


interface InventoryTableProps {
  inventory: InventoryDocument[];
}

export default function InventoryTable({
  inventory,
}: InventoryTableProps) {
  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Reserved</TableHead>
            <TableHead>Incoming</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-muted-foreground"
              >
                No inventory found.
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item._id.toString()}>
                <TableCell>
                  {(item.productId as any)?.title ?? "-"}
                </TableCell>

                <TableCell>
                  {item.variants[0]?.sku ?? "-"}
                </TableCell>

                <TableCell>
                  {item.warehouse}
                </TableCell>

                <TableCell>
                  {item.variants[0]?.availableStock}
                </TableCell>

                <TableCell>
                  {item.variants[0]?.reservedStock}
                </TableCell>

                <TableCell>
                  {item.variants[0]?.incomingStock}
                </TableCell>

                <TableCell>
  {item.variants[0]?.availableStock === 0 ? (
    <Badge variant="destructive">
      Out of Stock
    </Badge>
  ) : item.variants[0]?.availableStock <=
    item.variants[0]?.lowStockThreshold ? (
    <Badge variant="secondary">
      Low Stock
    </Badge>
  ) : (
    <Badge>
      In Stock
    </Badge>
  )}
</TableCell>

                <TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    <EditInventoryDialog inventory={item} />

    <Button variant="ghost" size="icon" disabled>
      <Boxes className="h-4 w-4" />
    </Button>

    <DeleteInventoryDialog inventory={item} />
  </div>
</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}