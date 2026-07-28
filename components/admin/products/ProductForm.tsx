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
        taxClass: "18",
        discountType: "none",
        discountValue: 0,
      },

      inventory: {
        sku: "",
        barcode: "",
        quantity: 0,
        lowStockThreshold: 5,
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
        publishedAt: undefined,
      },
    },
  });

  const onSubmit = async (
  data: ProductFormValues
) => {
    console.log(data);

    // API call here
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
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