"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductForm from "@/components/admin/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `/api/admin/dashboard/products/${params.id}`
        );

        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-zinc-400">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="text-zinc-400">
          Update your product information.
        </p>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
      />
    </div>
  );
}