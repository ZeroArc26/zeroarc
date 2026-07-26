import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductInventory from "./ProductInventory";
import ProductPublishCard from "./ProductPublishCard";
import ProductImages from "./ProductImages";
import ProductVariants from "./ProductVariants";
import ProductSEO from "./ProductSEO";

interface ProductFormProps {
  mode?: "create" | "edit";
  initialData?: unknown;
}

export default function ProductForm({
  mode = "create",
  initialData,
}: ProductFormProps) {
  void mode;
  void initialData;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <ProductBasicInfo />
        <ProductPricing />
        <ProductInventory />
        <ProductImages />
        <ProductVariants />
        <ProductSEO />
      </div>

      <div className="space-y-8">
  <ProductPublishCard />
</div>
    </div>
  );
}