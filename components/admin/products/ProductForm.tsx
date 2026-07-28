"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product.schema";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductInventory from "./ProductInventory";
import ProductImages from "./ProductImages/ProductImages";
import ProductVariants from "./ProductVariants";
import ProductSEO from "./ProductSEO";
import ProductPublishCard from "./ProductPublishCard";

export default function ProductForm() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    shouldFocusError: true,

    defaultValues: {
      basicInfo: {
        title: "",
        slug: "",
        description: "",
        brand: "",
        category: "",
        tags: [],
      },

      pricing: {
        sellingPrice: 0,
        comparePrice: 0,
        costPrice: 0,
        taxClass: "GST 18%",
        discountType: "none",
        discountValue: 0,
      },

      inventory: {
        sku: "",
        barcode: "",
        quantity: 0,
        lowStockThreshold: 5,
        reorderLevel: 10,
        trackInventory: true,
        allowBackorders: false,
      },

      images: [],

      variants: [],

      seo: {
        metaTitle: "",
        metaDescription: "",
        index: true,
      },

      publish: {
        status: "draft",
        featured: false,
        publishedAt: null,
      },
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to create product.");
        console.error(result);
        return;
      }

      alert("✅ Product created successfully!");
      console.log(result.product);

      methods.reset();
    } catch (error) {
      console.error("Create Product Error:", error);
      alert("Something went wrong.");
    }
  };

const onError = (errors: any) => {
  console.log(errors);
  alert("Check Console");
};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        <ProductBasicInfo />

        <ProductPricing />

        <ProductInventory />

        <ProductVariants />

        <ProductImages />

        <ProductSEO />

        <ProductPublishCard />
      </form>
    </FormProvider>
  );
}