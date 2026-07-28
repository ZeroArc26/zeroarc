import Link from "next/link";
import { ArrowLeft, Eye, Save, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  mode: "create" | "edit";
  productName?: string;
}

export default function ProductHeader({
  mode,
  productName,
}: ProductHeaderProps) {
  return (
    <div className="sticky top-0 z-40 -mx-8 border-b border-zinc-800/80 bg-[#09090B]/80 px-8 py-6 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/admin/dashboard/products"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h1>

          <p className="mt-2 text-zinc-400">
            {mode === "create"
              ? "Create and publish products for your ZeroArc store."
              : `Editing ${productName}`}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Badge className="rounded-full bg-yellow-500/15 text-yellow-400 border-yellow-500/30">
              Draft
            </Badge>

            <Badge
              variant="outline"
              className="rounded-full border-zinc-700 text-zinc-300"
            >
              Auto Saved Just Now
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Eye size={18} />
            Preview
          </Button>

          <Button variant="secondary" className="gap-2">
            <Save size={18} />
            Save Draft
          </Button>

          <Button className="gap-2 rounded-xl">
            <Rocket size={18} />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}