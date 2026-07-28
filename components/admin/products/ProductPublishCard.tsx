import {
  Globe,
  Rocket,
  Save,
  ShieldCheck,
  CircleDashed,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductPublishCard() {
  const completed = 2;
  const total = 5;
  const progress = (completed / total) * 100;

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

          <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
            <CircleDashed size={14} />
            Draft
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
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            Product Name
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            Slug
          </div>

          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle size={16} />
            Images Required
          </div>

          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle size={16} />
            Pricing
          </div>

          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle size={16} />
            Inventory
          </div>
        </div>
      </div>

      {/* Status & Visibility */}
      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label>Status</Label>

          <Select defaultValue="draft">
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

          <Select defaultValue="public">
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
        <Button
  type="submit"
  variant="secondary"
  className="w-full gap-2 rounded-xl"
>
  <Save size={16} />
  Save Draft
</Button>

        <Button
  type="submit"
  className="w-full gap-2 rounded-xl"
>
  <Globe size={16} />
  Publish Product
</Button>
      </div>
      <button
  type="submit"
  className="w-full rounded-xl bg-red-600 p-3 text-white"
>
  TEST SUBMIT
</button>
    </div>
  );
}