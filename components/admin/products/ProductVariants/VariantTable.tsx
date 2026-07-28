"use client";

import {
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { VariantTableProps } from "./types";

export default function VariantTable({
  variants,
  setVariants,
}: VariantTableProps) {

  const handleDelete = (id: string) => {
    setVariants((prev) =>
      prev.filter((variant) => variant.id !== id)
    );
  };

  const handleDuplicate = (id: string) => {
    const variant = variants.find((v) => v.id === id);

    if (!variant) return;

    setVariants((prev) => [
      ...prev,
      {
        ...variant,
        id: crypto.randomUUID(),
        sku: `${variant.sku}-COPY`,
      },
    ]);
  };

  if (!variants.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">

          <div className="mb-5 text-6xl">
            📦
          </div>

          <h3 className="text-xl font-semibold">
            No Variants Yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Select colors and sizes above,
            then click Generate Variants.
          </p>

        </CardContent>
      </Card>
    );
  }

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Product Variants
        </CardTitle>

      </CardHeader>

      <CardContent>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Color</TableHead>

              <TableHead>Size</TableHead>

              <TableHead>SKU</TableHead>

              <TableHead>Price</TableHead>

              <TableHead>Stock</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>
                        {variants.map((variant) => (
              <TableRow key={variant.id}>

                {/* Color */}

                <TableCell>

                  <div className="flex items-center gap-3">

                    <span
                      className="h-4 w-4 rounded-full border"
                      style={{
                        backgroundColor:
                          variant.colorHex || "#000",
                      }}
                    />

                    <span className="font-medium">
                      {variant.color}
                    </span>

                  </div>

                </TableCell>

                {/* Size */}

                <TableCell>

                  <Badge variant="secondary">
                    {variant.size}
                  </Badge>

                </TableCell>

                {/* SKU */}

                <TableCell className="font-mono text-xs">
                  {variant.sku}
                </TableCell>

                {/* Price */}

                <TableCell>
                  ₹{variant.price}
                </TableCell>

                {/* Stock */}

                <TableCell>

                  <Badge
                    variant={
                      variant.stock <= 10
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {variant.stock}
                  </Badge>

                </TableCell>

                {/* Status */}

                <TableCell>

                  <Badge
                    variant={
                      variant.isActive
                        ? "default"
                        : "secondary"
                    }
                  >
                    {variant.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>

                </TableCell>

                {/* Actions */}

                <TableCell>

                  <div className="flex justify-end gap-2">

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDuplicate(
                          variant.id
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(
                          variant.id
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                  </div>

                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  );
}