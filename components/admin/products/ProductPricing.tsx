import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductPricing() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        Pricing
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Configure the pricing details for this product.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Selling Price</Label>

          <Input
            id="price"
            type="number"
            placeholder="999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comparePrice">
            Compare At Price
          </Label>

          <Input
            id="comparePrice"
            type="number"
            placeholder="1299"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">
            Cost Price
          </Label>

          <Input
            id="costPrice"
            type="number"
            placeholder="650"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax">
            Tax Class
          </Label>

          <Input
            id="tax"
            placeholder="GST 18%"
          />
        </div>
      </div>
    </div>
  );
}