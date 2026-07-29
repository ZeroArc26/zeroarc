import PageHeader from "@/components/admin/shared/PageHeader";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductTable from "@/components/admin/products/ProductTable";

import { getProducts } from "@/lib/actions/products/getProducts";

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