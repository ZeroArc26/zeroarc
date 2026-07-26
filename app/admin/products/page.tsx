import PageHeader from "@/components/admin/shared/PageHeader";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductTable from "@/components/admin/products/ProductTable";

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Manage your products, inventory and pricing."
      />

      <ProductToolbar />

      <ProductTable />
    </div>
  );
}