import {
  Globe,
  Rocket,
  Save,
  ShieldCheck,
  CircleDashed,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductPublishCardProps = {
  mode?: "create" | "edit";
};

export default function ProductPublishCard({
  mode = "create",
}: ProductPublishCardProps) {
  const { setValue, watch } = useFormContext();

  const status = watch("publish.status");
  const visibility = watch("publish.visibility");
  const title = watch("basicInfo.title");
  const slug = watch("basicInfo.slug");
  const images = watch("images");
  const sellingPrice = watch("pricing.sellingPrice");
  const quantity = watch("inventory.quantity");

  const checklist = [
    { label: "Product Name", done: Boolean(title?.trim()) },
    { label: "Slug", done: Boolean(slug?.trim()) },
    { label: "Images Required", done: Boolean(images?.length) },
    { label: "Pricing", done: Boolean(sellingPrice > 0) },
    { label: "Inventory", done: Boolean(quantity >= 0 && quantity !== undefined && quantity !== null && quantity !== "") },
  ];

  const completed = checklist.filter((item) => item.done).length;
  const total = checklist.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <Rocket size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Publish
          </h2>

          <p className="text-sm text-zinc-400">
            Ready to launch your product.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            Current Status
          </span>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              status === "active"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : status === "archived"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            }`}
          >
            <CircleDashed size={14} />
            {status || "Draft"}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-white">
            Product Completion
          </span>

          <span className="text-sm text-violet-400">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
        <h3 className="mb-4 font-semibold text-white">
          Checklist
        </h3>

        <div className="space-y-3 text-sm">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 ${
                item.done ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {item.done ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Status & Visibility */}
      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={status}
            onValueChange={(value) =>
              setValue("publish.status", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="draft">
                Draft
              </SelectItem>

              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="archived">
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Visibility</Label>

          <Select
            value={visibility}
            onValueChange={(value) =>
              setValue("publish.visibility", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="public">
                Public
              </SelectItem>

              <SelectItem value="hidden">
                Hidden
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-zinc-500">
            Hidden products stay reachable by direct link, but won&apos;t
            appear on the homepage, category pages, search, or new
            arrivals.
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={18}
            className="mt-0.5 text-violet-400"
          />

          <div className="text-sm text-zinc-300">
            Publishing will make this product available to customers based on its visibility settings.
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        {mode === "edit" ? (
  <Button
    type="submit"
    className="w-full gap-2 rounded-xl"
  >
    <Save size={16} />
    Save Changes
  </Button>
) : (
  <>
    <Button
      type="submit"
      variant="secondary"
      className="w-full gap-2 rounded-xl"
      onClick={() =>
        setValue("publish.status", "draft", { shouldValidate: true })
      }
    >
      <Save size={16} />
      Save Draft
    </Button>

    <Button
      type="submit"
      className="w-full gap-2 rounded-xl"
      onClick={() =>
        setValue("publish.status", "active", { shouldValidate: true })
      }
    >
      <Globe size={16} />
      Publish Product
    </Button>
  </>
)}
      </div>
      
    </div>
  );
}