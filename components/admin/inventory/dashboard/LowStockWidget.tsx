"use client";

import Image from "next/image";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Shadow Ronin",
    image: "/placeholder.svg",
    color: "Black",
    size: "M",
    stock: 2,
  },
  {
    id: 2,
    name: "Violet Void",
    image: "/placeholder.svg",
    color: "Purple",
    size: "XL",
    stock: 1,
  },
  {
    id: 3,
    name: "Crimson Eclipse",
    image: "/placeholder.svg",
    color: "Red",
    size: "L",
    stock: 3,
  },
];

export default function LowStockWidget() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Low Stock Products
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">
                {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                className="rounded-lg border object-cover"
              />

              <div>
                <h3 className="font-semibold">{product.name}</h3>

                <p className="text-sm text-muted-foreground">
                  {product.color} • {product.size}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-600"
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {product.stock} Left
                  </Badge>
                </div>
              </div>
            </div>

            <Button size="sm">
              Adjust Stock
            </Button>
          </div>
        ))}

        {products.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground" />

            <h3 className="font-semibold">
              No Low Stock Products
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Everything is sufficiently stocked.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}