import PageHeader from "@/components/admin/shared/PageHeader";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductTable from "@/components/admin/products/ProductTable";

import { getProducts } from "@/lib/actions/products/getProducts";

// Admin-only internal page reading live product data — must never
// serve a cached/stale snapshot (e.g. a deleted product still showing
// up here after being removed from the database).
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Manage your products, inventory and pricing."
      />

      <ProductToolbar />

      <ProductTable products={products} />
    </div>
  );
}