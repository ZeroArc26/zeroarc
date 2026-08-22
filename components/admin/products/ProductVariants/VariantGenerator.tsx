"use client";

import { useMemo, useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { VariantGeneratorProps, VariantPreset } from "./types";
import { generateVariants, isDuplicateVariant } from "./utils";

const DEFAULT_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Red", hex: "#DC2626" },
  { name: "Green", hex: "#16A34A" },
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Beige", hex: "#D6C6B8" },
  { name: "Peach", hex: "#FFCBA4" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Dusky Pink", hex: "#C48A8A" },
  { name: "Maroon", hex: "#800000" },
];

const DEFAULT_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
];

export default function VariantGenerator({
  variants,
  setVariants,
}: VariantGeneratorProps) {
  const [preset, setPreset] =
    useState<VariantPreset>("custom");

  const [selectedColors, setSelectedColors] =
    useState<string[]>([]);

  const [selectedSizes, setSelectedSizes] =
    useState<string[]>([]);

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState("");

    const totalVariants = useMemo(
    () => selectedColors.length * selectedSizes.length,
    [selectedColors, selectedSizes]
  );

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const applyPreset = (value: VariantPreset) => {
    setPreset(value);

    if (value === "basic") {
      setSelectedColors(["Black", "White"]);
      setSelectedSizes(["S", "M", "L", "XL"]);
    } else if (value === "full") {
      setSelectedColors([
  "Black",
  "White",
  "Beige",
  "Navy",
  "Red",
  "Green",
  "Brown",
]);
      setSelectedSizes(["S", "M", "L", "XL", "XXL", "XXXL"]);
    } else {
      setSelectedColors([]);
      setSelectedSizes([]);
    }
  };

  const handleGenerate = () => {
    const generated = generateVariants(
  selectedColors,
  selectedSizes,
  Number(price),
  Number(stock),
  DEFAULT_COLORS
);

    // Only add combinations that don't already exist — this was
    // previously a hard replace, which wiped out every existing
    // variant's stock/SKU/image data whenever "Generate" was clicked
    // again (e.g. to add just one new size to an existing product).
    const newOnes = generated.filter(
      (v) => !isDuplicateVariant(variants, v.color, v.size)
    );

    const skipped = generated.length - newOnes.length;

    setVariants([...variants, ...newOnes]);

    if (skipped > 0) {
      toast.info(
        `Added ${newOnes.length} new variant${newOnes.length !== 1 ? "s" : ""}. ${skipped} combination${skipped !== 1 ? "s" : ""} already existed and ${skipped !== 1 ? "were" : "was"} left unchanged.`
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Variant Generator
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Create multiple variants automatically.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* Presets */}

<div className="space-y-4">

  <Label>Quick Presets</Label>

  <div className="grid gap-4 md:grid-cols-3">

    {[
      {
        value: "basic",
        title: "📦 Basic",
        subtitle: "2 Colors • 4 Sizes",
        total: "8 Variants",
      },
      {
        value: "full",
        title: "🌈 Full Collection",
        subtitle: "7 Colors • 6 Sizes",
        total: "42 Variants",
      },
      {
        value: "custom",
        title: "⚙ Custom",
        subtitle: "Choose manually",
        total: "Unlimited",
      },
    ].map((presetCard) => {

      const selected =
        preset === presetCard.value;

      return (
        <button
          key={presetCard.value}
          type="button"
          onClick={() =>
            applyPreset(
              presetCard.value as VariantPreset
            )
          }
          className={`rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] ${
            selected
              ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
              : "border-border hover:border-violet-400/40"
          }`}
        >
          <h3 className="text-lg font-semibold">
            {presetCard.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {presetCard.subtitle}
          </p>

          <div className="mt-5 flex items-center justify-between">

            <span className="text-sm font-medium text-violet-500">
              {presetCard.total}
            </span>

            {selected && (
              <div className="rounded-full bg-violet-500 px-2 py-1 text-xs text-white">
                Selected
              </div>
            )}

          </div>
        </button>
      );
    })}

  </div>

</div>

        {/* Colors */}

<div className="space-y-4">

  <Label className="text-base font-semibold">
    🎨 Choose Colors
  </Label>

  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">

    {DEFAULT_COLORS.map((color) => {

      const selected =
        selectedColors.includes(color.name);

      return (
        <button
          key={color.name}
          type="button"
          onClick={() => toggleColor(color.name)}
          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
            selected
              ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
              : "border-border hover:border-violet-400/40 hover:bg-muted/40"
          }`}
        >

          {selected && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
              ✓
            </div>
          )}

          <div className="flex flex-col items-center gap-3">

            <span
              className="h-12 w-12 rounded-full border-2 shadow-sm"
              style={{
                backgroundColor: color.hex,
                borderColor:
                  color.name === "White"
                    ? "#d4d4d8"
                    : color.hex,
              }}
            />

            <div>

              <p className="font-medium">
                {color.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {selected
                  ? "Selected"
                  : "Click to select"}
              </p>

            </div>

          </div>

        </button>
      );
    })}

  </div>

</div>

        {/* Sizes */}

        <div className="space-y-3">

          <Label>Sizes</Label>

          <div className="flex flex-wrap gap-3">

            {DEFAULT_SIZES.map((size) => {

              const selected =
                selectedSizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    toggleSize(size)
                  }
                  className={`rounded-xl border px-4 py-2 transition ${
                    selected
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-border"
                  }`}
                >
                  {size}
                </button>
              );
            })}


          </div>

        </div>

        {/* Price & Stock */}

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>Common Price</Label>

            <Input
              type="number"
              placeholder="799"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Common Stock</Label>

            <Input
              type="number"
              placeholder="100"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
            />
          </div>

        </div>

        <Button
          type="button"
          className="w-full h-11"
          disabled={
            !selectedColors.length ||
            !selectedSizes.length ||
            !price ||
            !stock
          }
          onClick={handleGenerate}
        >
          Generate {totalVariants} Variant
          {totalVariants !== 1 ? "s" : ""}
        </Button>

      </CardContent>
    </Card>
  );
}