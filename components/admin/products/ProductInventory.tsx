import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProductInventory() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        Inventory
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Manage stock, SKU and inventory settings.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="space-y-2">
          <Label htmlFor="sku">
            SKU
          </Label>

          <Input
            id="sku"
            placeholder="ZA-TEE-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">
            Barcode
          </Label>

          <Input
            id="barcode"
            placeholder="123456789012"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">
            Stock Quantity
          </Label>

          <Input
            id="stock"
            type="number"
            placeholder="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStock">
            Low Stock Alert
          </Label>

          <Input
            id="lowStock"
            type="number"
            placeholder="10"
          />
        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 p-4">
          <div>
            <p className="font-semibold text-white">
              Track Inventory
            </p>

            <p className="text-sm text-zinc-400">
              Automatically reduce stock after every order.
            </p>
          </div>

          <Switch />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 p-4">
          <div>
            <p className="font-semibold text-white">
              Continue Selling
            </p>

            <p className="text-sm text-zinc-400">
              Allow orders even when stock reaches zero.
            </p>
          </div>

          <Switch />
        </div>

      </div>

    </div>
  );
}