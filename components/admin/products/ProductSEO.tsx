import { useFormContext } from "react-hook-form";

import type { ProductFormValues } from "@/lib/validations/product.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function ProductSEO() {
  const {
    register,
    watch,
    setValue,
  } = useFormContext<ProductFormValues>();

  const metaTitle = watch("seo.metaTitle") ?? "";
  const metaDescription = watch("seo.metaDescription") ?? "";

  const title = watch("basicInfo.title") ?? "";
  const slug = watch("basicInfo.slug") ?? "";
  const description = watch("basicInfo.description") ?? "";

  const previewTitle =
    metaTitle || (title ? `${title} | ZeroArc` : "Product Title | ZeroArc");

  const previewDescription =
    metaDescription ||
    description.slice(0, 160) ||
    "Your product description will appear here in Google Search results.";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          🔍 Search Engine Optimization
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Improve how this product appears in Google Search.
        </p>
      </div>

      <div className="space-y-6">

        {/* Meta Title */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaTitle">
              Meta Title
            </Label>

            <span className="text-xs text-zinc-500">
              {metaTitle.length}/60
            </span>
          </div>

          <Input
            id="metaTitle"
            maxLength={60}
            placeholder={
              title
                ? `${title} | ZeroArc`
                : "Product Title | ZeroArc"
            }
            {...register("seo.metaTitle")}
          />
        </div>

        {/* Meta Description */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaDescription">
              Meta Description
            </Label>

            <span className="text-xs text-zinc-500">
              {metaDescription.length}/160
            </span>
          </div>

          <Textarea
            id="metaDescription"
            rows={4}
            maxLength={160}
            placeholder={
              description
                ? description.slice(0, 160)
                : "Auto generated from product description"
            }
            {...register("seo.metaDescription")}
          />
        </div>

        {/* Index Toggle */}

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <div>
            <Label className="text-base">
              Allow Google Indexing
            </Label>

            <p className="mt-1 text-sm text-zinc-400">
              Search engines can index this product.
            </p>
          </div>

          <Switch
            checked={watch("seo.index")}
            onCheckedChange={(checked) =>
              setValue("seo.index", checked)
            }
          />
        </div>

        {/* Google Preview */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Google Search Preview
          </h3>

          <div className="space-y-2">
            <h4 className="truncate text-xl font-medium text-blue-400">
              {previewTitle}
            </h4>

            <p className="truncate text-sm text-green-500">
              https://zeroarc.com/products/{slug || "product-slug"}
            </p>

            <p className="text-sm leading-6 text-zinc-400 line-clamp-2">
              {previewDescription}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}