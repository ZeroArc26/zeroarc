"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Package2, CheckCircle2, ChevronDown, X } from "lucide-react";


import type { ProductFormValues } from "@/lib/validations/product.schema";
import {
  generateSKU,
  generateBarcode,
} from "@/lib/utils/inventory";
import { COLLECTIONS } from "@/constants/collections";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductBasicInfo() {
  const {
    register,
    watch,
    setValue,
  } = useFormContext<ProductFormValues>();

  const tags = watch("basicInfo.tags") ?? [];

  const [customTagInput, setCustomTagInput] = useState("");

  function toggleTag(tag: string) {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];

    setValue("basicInfo.tags", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function addCustomTag() {
    const value = customTagInput.trim();
    if (!value || tags.includes(value)) {
      setCustomTagInput("");
      return;
    }

    setValue("basicInfo.tags", [...tags, value], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCustomTagInput("");
  }

  const title = watch("basicInfo.title") ?? "";
  const slug = watch("basicInfo.slug") ?? "";
  const description = watch("basicInfo.description") ?? "";
  const metaTitle = watch("seo.metaTitle") ?? "";
  const metaDescription = watch("seo.metaDescription") ?? "";
  const sku = watch("inventory.sku") ?? "";
  const audience = watch("basicInfo.audience") ?? "unisex";
  const fitType = watch("basicInfo.fitType") ?? "";

  /* ------------------------------------------ */
  /* Auto Slug                                  */
  /* ------------------------------------------ */
useEffect(() => {
  if (!title.trim()) {
    setValue("basicInfo.slug", "");
    return;
  }

  const generatedSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  setValue("basicInfo.slug", generatedSlug, {
    shouldDirty: false,
    shouldValidate: true,
  });
}, [title, setValue]);

/* ------------------------------------------ */
/* Auto SKU                                   */
/* ------------------------------------------ */

useEffect(() => {
  // Title empty ho to SKU bhi clear kar do
  if (!title.trim()) {
    setValue("inventory.sku", "", {
      shouldDirty: false,
      shouldValidate: true,
    });
    return;
  }

  // Sirf tab generate karo jab SKU empty ho
  if (!sku.trim()) {
    setValue(
      "inventory.sku",
      generateSKU(title),
      {
        shouldDirty: false,
        shouldValidate: true,
      }
    );
  }
}, [title, sku, setValue]);

/* ------------------------------------------ */
/* Auto Barcode                               */
/* ------------------------------------------ */

const barcode = watch("inventory.barcode");

useEffect(() => {
  if (!barcode) {
    setValue("inventory.barcode", generateBarcode(), {
      shouldDirty: false,
      shouldValidate: true,
    });
  }
}, [barcode, setValue]);

  /* ------------------------------------------ */
  /* Auto SEO Title                             */
  /* ------------------------------------------ */

  useEffect(() => {
    if (!title.trim()) return;

    if (!metaTitle.trim()) {
      setValue(
        "seo.metaTitle",
        `${title} | ZeroArc`,
        {
          shouldDirty: false,
          shouldValidate: false,
        }
      );
    }
  }, [title, metaTitle, setValue]);

  /* ------------------------------------------ */
  /* Auto SEO Description                       */
  /* ------------------------------------------ */

  useEffect(() => {
    if (!description.trim()) return;

    if (!metaDescription.trim()) {
      setValue(
        "seo.metaDescription",
        description.slice(0, 160),
        {
          shouldDirty: false,
          shouldValidate: false,
        }
      );
    }
  }, [description, metaDescription, setValue]);

  return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-xl">
      {/* Header */}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <Package2 size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Basic Information
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Everything customers see before purchasing your product.
          </p>
        </div>
      </div>

      <div className="my-8 h-px bg-gradient-to-r from-violet-500/30 via-zinc-800 to-transparent" />

      <div className="space-y-8">
        {/* Product Title */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="title">
              Product Title
            </Label>

            <span className="text-xs text-zinc-500">
              {title.length}/120
            </span>
          </div>

          <Input
            id="title"
            placeholder="Naruto Oversized Tee"
            maxLength={120}
            {...register("basicInfo.title")}
          />

          <p className="mt-2 text-xs text-zinc-500">
            Choose a clear, searchable and descriptive product title.
          </p>
        </div>

        {/* Product Slug */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="slug">
              Product Slug
            </Label>

            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 size={14} />
              Auto Generated
            </span>
          </div>

          <Input
            id="slug"
            placeholder="naruto-oversized-tee"
            {...register("basicInfo.slug")}
          />

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>Product URL:</span>

            <span className="font-medium text-violet-400 break-all">
              /products/{slug || "your-product-slug"}
            </span>
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            SEO-friendly URLs improve discoverability and look cleaner when
            shared.
          </p>
        </div>
                {/* Brand & Category */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* Brand */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <Label htmlFor="brand">
                Brand
              </Label>

              <span className="text-xs text-zinc-500">
                Optional
              </span>

            </div>

            <Input
              id="brand"
              placeholder="ZeroArc"
              {...register("basicInfo.brand")}
            />

            <p className="mt-2 text-xs text-zinc-500">
              Display your brand name to build trust and improve recognition.
            </p>

          </div>

          {/* Category */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <Label htmlFor="category">
                Category
              </Label>

              <span className="text-xs text-red-400">
                Required
              </span>

            </div>

            <Input
              id="category"
              placeholder="Anime Oversized T-Shirts"
              {...register("basicInfo.category")}
            />

            <p className="mt-2 text-xs text-zinc-500">
              Categories help customers browse products more easily.
            </p>

          </div>

          {/* Audience */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <Label htmlFor="audience">
                Audience
              </Label>

              <span className="text-xs text-red-400">
                Required
              </span>

            </div>

            <Select
              value={audience}
              onValueChange={(value) =>
                setValue("basicInfo.audience", value as "men" | "women" | "unisex", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="audience">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>

            <p className="mt-2 text-xs text-zinc-500">
              Decides whether this product shows up on the Men&apos;s or
              Women&apos;s collection page.
            </p>

          </div>

        </div>

        {/* Fit Type */}

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <div className="mb-2 flex items-center justify-between">

              <Label htmlFor="fitType">
                Fit Type
              </Label>

              <span className="text-xs text-zinc-500">
                Optional
              </span>

            </div>

            <Select
              value={fitType}
              onValueChange={(value) =>
                setValue("basicInfo.fitType", value as "slim" | "regular" | "oversized", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="fitType">
                <SelectValue placeholder="Select fit type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="oversized">Oversized</SelectItem>
              </SelectContent>
            </Select>

            <p className="mt-2 text-xs text-zinc-500">
              Powers the visual fit-scale shown on the product page.
            </p>

          </div>

        </div>

        {/* Product Specifications */}

        <div>

          <p className="mb-4 text-sm font-semibold text-white">
            Product Specifications
            <span className="ml-2 text-xs font-normal text-zinc-500">
              (Optional — shown in the &quot;Details&quot; tab on the product page)
            </span>
          </p>

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <Label htmlFor="fabric">Fabric</Label>
              <Input
                id="fabric"
                placeholder="240 GSM Premium Cotton"
                className="mt-2"
                {...register("basicInfo.fabric")}
              />
            </div>

            <div>
              <Label htmlFor="sleeveType">Sleeve Type</Label>
              <Input
                id="sleeveType"
                placeholder="Half Sleeve, Drop Shoulder"
                className="mt-2"
                {...register("basicInfo.sleeveType")}
              />
            </div>

            <div>
              <Label htmlFor="neckType">Neck Type</Label>
              <Input
                id="neckType"
                placeholder="Round Neck"
                className="mt-2"
                {...register("basicInfo.neckType")}
              />
            </div>

            <div>
              <Label htmlFor="printType">Print Type</Label>
              <Input
                id="printType"
                placeholder="High Quality, Long-lasting"
                className="mt-2"
                {...register("basicInfo.printType")}
              />
            </div>

            <div>
              <Label htmlFor="washCare">Wash Care</Label>
              <Input
                id="washCare"
                placeholder="Pre-shrunk, Machine Washable"
                className="mt-2"
                {...register("basicInfo.washCare")}
              />
            </div>

          </div>

        </div>
                {/* Tags */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <Label htmlFor="tags">
              Tags
            </Label>

            <span className="text-xs text-zinc-500">
              Collection tags shown first, or add your own
            </span>

          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="tags"
                className="flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
              >
                {tags.length > 0
                  ? `${tags.length} tag${tags.length !== 1 ? "s" : ""} selected`
                  : "Select or add tags"}
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-3" align="start">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Collections
                </p>

                <div className="space-y-2">
                  {COLLECTIONS.map((collection) => (
                    <label
                      key={collection.tag}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={tags.includes(collection.tag)}
                        onCheckedChange={() => toggleTag(collection.tag)}
                      />
                      {collection.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Custom Tag
                </p>

                <div className="flex gap-2">
                  <Input
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                    placeholder="e.g. Naruto"
                    className="h-9"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="shrink-0 rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => {
                const collection = COLLECTIONS.find((c) => c.tag === tag);
                return (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300"
                  >
                    {collection?.name ?? tag}
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="text-violet-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <p className="mt-2 text-xs text-zinc-500">
            Collection tags control which storefront collection page this
            product appears on.
          </p>

        </div>

        {/* Product Description */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <Label htmlFor="description">
              Product Description
            </Label>

            <span className="text-xs text-zinc-500">
              {description.length}/5000
            </span>

          </div>

          <textarea
            id="description"
            rows={8}
            maxLength={5000}
            placeholder="Describe your product in detail. Mention the fabric, fit, design inspiration, wash care instructions and anything else that helps customers make a buying decision."
            className="flex min-h-[220px] w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            {...register("basicInfo.description")}
          />

          <div className="mt-3 flex items-center justify-between text-xs">

            <span className="text-zinc-500">
              This description will also be used to generate the default SEO description.
            </span>

            <span
              className={
                description.length > 4500
                  ? "text-yellow-400"
                  : "text-zinc-500"
              }
            >
              {5000 - description.length} characters remaining
            </span>

          </div>

        </div>
              </div>
    </div>
  );
}