"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ProductImageUpload from "@/components/admin/products/ProductImageUpload";

import { productSchema } from "@/lib/validations/product";

type ProductFormProps = {
  mode: "create" | "edit";
  initialData?: any;
};

export default function ProductForm({
  mode,
  initialData,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const {
  register,
  control,
  handleSubmit,
  watch,
  setValue,
  reset,
  formState: { errors },
} = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
  title: "",
  slug: "",
  description: "",
  price: 0,
  comparePrice: 0,
  category: "",
  collectionName: "",
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  variants: [
  {
    color: "",
    size: "",
    stock: 0,
  },
],
  lowStockLimit: 5,
  featured: false,
  bestseller: false,
  newArrival: false,
  active: true,
},
  });

  const { fields, append, remove } = useFieldArray({
  control,
  name: "variants",
});

  const title = watch("title");
  const images = watch("images");

  useEffect(() => {
  if (mode === "edit") return;

  const slug = title
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  setValue("slug", slug);
}, [title, setValue, mode]);

  useEffect(() => {
  if (mode === "edit" && initialData) {
    reset(initialData);
  }
}, [mode, initialData, reset]);

  const onSubmit = async (data: any) => {
  try {
    setLoading(true);

    const endpoint =
  mode === "create"
    ? "/api/admin/products"
    : `/api/admin/products/${initialData._id}`;

const method =
  mode === "create"
    ? "POST"
    : "PUT";

const res = await fetch(endpoint, {
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

    const result = await res.json();

    if (!res.ok) {
  console.log(result);
  alert(
  result.message ||
    (mode === "create"
      ? "Failed to create product."
      : "Failed to update product.")
);
  return;
}

    alert(
  mode === "create"
    ? "✅ Product created successfully!"
    : "✅ Product updated successfully!"
);

    window.location.href = "/admin/products";
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
    >
      <h2 className="mb-8 text-3xl font-bold">
        {mode === "create"
          ? "Create Product"
          : "Edit Product"}
      </h2>

      <div className="space-y-10">

        {/* ================= Basic Information ================= */}

        <section>

          <h3 className="mb-6 text-xl font-semibold">
            Basic Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Product Title
              </label>

              <input
                {...register("title")}
                placeholder="Oversized Anime T-Shirt"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.title.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Slug
              </label>

              <input
                {...register("slug")}
                readOnly
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400 outline-none"
              />

              {errors.slug && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.slug.message)}
                </p>
              )}
            </div>

          </div>

          <div className="mt-6">

            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={6}
              placeholder="Write product description..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
            />

            {errors.description && (
              <p className="mt-2 text-sm text-red-500">
                {String(errors.description.message)}
              </p>
            )}

          </div>

        </section>

                {/* ================= Pricing ================= */}

        <section>

          <h3 className="mb-6 text-xl font-semibold">
            Pricing
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Price (₹)
              </label>

              <input
                type="number"
                {...register("price", {
                  valueAsNumber: true,
                })}
                placeholder="999"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.price && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.price.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Compare Price (₹)
              </label>

              <input
                type="number"
                {...register("comparePrice", {
                  valueAsNumber: true,
                })}
                placeholder="1499"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.comparePrice && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.comparePrice.message)}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* ================= Inventory ================= */}

        <section>

          <h3 className="mb-6 text-xl font-semibold">
            Inventory
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Stock
              </label>

              <input
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                })}
                placeholder="100"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.stock && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.stock.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Low Stock Limit
              </label>

              <input
                type="number"
                {...register("lowStockLimit", {
                  valueAsNumber: true,
                })}
                placeholder="5"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.lowStockLimit && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.lowStockLimit.message)}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* ================= Category ================= */}

        <section>

          <h3 className="mb-6 text-xl font-semibold">
            Organization
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Category
              </label>

              <input
                {...register("category")}
                placeholder="Anime"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.category && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.category.message)}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Collection
              </label>

              <input
                {...register("collectionName")}
                placeholder="Summer Drop 2026"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-violet-500"
              />

              {errors.collectionName && (
                <p className="mt-2 text-sm text-red-500">
                  {String(errors.collectionName.message)}
                </p>
              )}

            </div>

          </div>

        </section>

        <ProductImageUpload
  images={images}
  onChange={(newImages) => {
    setValue("images", newImages, {
      shouldValidate: true,
    });
  }}
/>

<section>
  <h3 className="mb-6 text-xl font-semibold">Variants</h3>

  <div className="space-y-4">
    {fields.map((field, index) => (
      <div
        key={field.id}
        className="grid gap-4 rounded-xl border border-zinc-700 p-4 md:grid-cols-4"
      >
        <input
          {...register(`variants.${index}.color`)}
          placeholder="Color"
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
        />

        <input
          {...register(`variants.${index}.size`)}
          placeholder="Size"
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
        />

        <input
          type="number"
          {...register(`variants.${index}.stock`, {
            valueAsNumber: true,
          })}
          placeholder="Stock"
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
        />

        <button
          type="button"
          onClick={() => remove(index)}
          className="rounded-xl bg-red-600 px-4 py-3 text-white"
        >
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        append({
          color: "",
          size: "",
          stock: 0,
        })
      }
      className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white"
    >
      + Add Variant
    </button>
  </div>
</section>

                {/* ================= Product Settings ================= */}

        <section>

          <h3 className="mb-6 text-xl font-semibold">
            Product Settings
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <label className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
              <div>
                <h4 className="font-medium">Featured Product</h4>
                <p className="text-sm text-zinc-400">
                  Show this product on homepage.
                </p>
              </div>

              <input
                type="checkbox"
                {...register("featured")}
                className="h-5 w-5 accent-violet-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
              <div>
                <h4 className="font-medium">Bestseller</h4>
                <p className="text-sm text-zinc-400">
                  Mark as bestselling product.
                </p>
              </div>

              <input
                type="checkbox"
                {...register("bestseller")}
                className="h-5 w-5 accent-violet-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
              <div>
                <h4 className="font-medium">New Arrival</h4>
                <p className="text-sm text-zinc-400">
                  Display inside New Arrival section.
                </p>
              </div>

              <input
                type="checkbox"
                {...register("newArrival")}
                className="h-5 w-5 accent-violet-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
              <div>
                <h4 className="font-medium">Active</h4>
                <p className="text-sm text-zinc-400">
                  Product is visible to customers.
                </p>
              </div>

              <input
                type="checkbox"
                {...register("active")}
                className="h-5 w-5 accent-violet-600"
              />
            </label>

          </div>

        </section>

        {/* ================= Coming Next ================= */}

        <section className="rounded-2xl border border-dashed border-zinc-700 p-6">

          <h3 className="text-lg font-semibold">
            🚀 Next Features
          </h3>

          <ul className="mt-4 space-y-2 text-sm text-zinc-400 list-disc pl-5">
            <li>Multiple Image Upload</li>
            <li>Color Variants</li>
            <li>Size Variants</li>
            <li>SEO Settings</li>
            <li>Product Preview</li>
          </ul>

        </section>

                {/* ================= Submit ================= */}

        <div className="flex justify-end pt-4">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create Product"
              : "Save Changes"}
          </button>

        </div>

      </div>
    </form>
  );
}