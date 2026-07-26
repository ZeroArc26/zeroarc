import PageHeader from "@/components/admin/shared/PageHeader";
import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Product"
        description="Create a new product for your ZeroArc store."
      />

      <ProductForm />
    </div>
  );
}