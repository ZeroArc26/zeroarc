"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  productSchema,
  type ProductFormValues,
  type ProductFormInput,
} from "@/lib/validations/product.schema";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductInventory from "./ProductInventory";
import ProductImages from "./ProductImages/ProductImages";
import ProductVariants from "./ProductVariants";
import ProductSEO from "./ProductSEO";
import ProductPublishCard from "./ProductPublishCard";


type ProductFormProps = {
  mode?: "create" | "edit";
  initialData?: ProductFormValues & {
    _id: string;
  };
};

export default function ProductForm({
  mode = "create",
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const methods = useForm<ProductFormInput, any, ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    shouldFocusError: true,

    defaultValues: initialData ?? {
      basicInfo: {
        title: "",
        slug: "",
        description: "",
        brand: "",
        category: "",
        audience: "unisex",
        fitType: undefined,
        fabric: "",
        sleeveType: "",
        neckType: "",
        printType: "",
        washCare: "",
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
      const url =
  mode === "edit"
    ? `/api/products/${initialData?._id}`
    : "/api/products";

const method =
  mode === "edit"
    ? "PUT"
    : "POST";

const response = await fetch(url, {
  method,
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

      console.log(result.product);

if (mode === "create") {
  methods.reset();
}

router.push("/admin/dashboard/products");
router.refresh();

    } catch (error) {
      console.error("Create Product Error:", error);
      alert("Something went wrong.");
    }
  };

const onError = (errors: any) => {
  console.log(errors);

  alert(Object.keys(errors).join(", "));
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

        <ProductPublishCard mode={mode} />
      </form>
    </FormProvider>
  );
}