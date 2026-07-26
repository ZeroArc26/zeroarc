import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProductSEO() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        SEO
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Optimize this product for search engines.
      </p>

      <div className="mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">
            Meta Title
          </Label>

          <Input
            id="metaTitle"
            placeholder="ZeroArc Oversized Tee"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">
            Meta Description
          </Label>

          <Textarea
            id="metaDescription"
            rows={4}
            placeholder="Write a short SEO description..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">
            Keywords
          </Label>

          <Input
            id="keywords"
            placeholder="oversized tee, anime, zeroarc..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonical">
            Canonical URL
          </Label>

          <Input
            id="canonical"
            placeholder="https://zeroarc.com/products/..."
          />
        </div>
      </div>
    </div>
  );
}