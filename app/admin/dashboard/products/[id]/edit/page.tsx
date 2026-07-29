import ProductForm from "@/components/admin/products/ProductForm";
import { getProductById } from "@/lib/actions/products/getProductById";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;
  console.log("EDIT PRODUCT ID:", id);

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      initialData={product}
    />
  );
}