import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Save, Rocket } from "lucide-react";

import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Product"
        description="Create and publish products for your ZeroArc store."
        backHref="/admin/dashboard/products"
        backLabel="Products"
        badge={
          <Badge className="rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20">
            Draft
          </Badge>
        }
        action={
          <>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button
              variant="secondary"
              className="gap-2 rounded-xl"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>

            <Button className="gap-2 rounded-xl">
              <Rocket className="h-4 w-4" />
              Publish
            </Button>
          </>
        }
      />

      <ProductForm />
    </div>
  );
}