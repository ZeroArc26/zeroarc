"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",

    price: "",
    comparePrice: "",

    category: "",
    collection: "",

    stock: "",

    images: "",
    sizes: "",
    colors: "",

    featured: false,
    bestseller: false,
    newArrival: false,
    active: true,
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);

        const data = await res.json();

        if (!data.success) {
          alert("Product not found");
          router.push("/admin/products");
          return;
        }

        const product = data.product;

        setFormData({
          title: product.title || "",
          slug: product.slug || "",
          description: product.description || "",

          price: String(product.price ?? ""),
          comparePrice: String(product.comparePrice ?? ""),

          category: product.category || "",
          collection: product.collection || "",

          stock: String(product.stock ?? ""),

          images: (product.images || []).join(", "),
          sizes: (product.sizes || []).join(", "),
          colors: (product.colors || []).join(", "),

          featured: product.featured || false,
          bestseller: product.bestseller || false,
          newArrival: product.newArrival || false,
          active: product.active ?? true,
        });

      } catch (error) {
        console.error(error);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id, router]);
    function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleUpdate() {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,

          price: Number(formData.price),
          comparePrice: Number(formData.comparePrice),

          category: formData.category,
          collection: formData.collection,

          stock: Number(formData.stock),

          images: formData.images
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          sizes: formData.sizes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          colors: formData.colors
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          featured: formData.featured,
          bestseller: formData.bestseller,
          newArrival: formData.newArrival,
          active: formData.active,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      alert("✅ Product Updated Successfully!");

      router.push("/admin/products");

    } catch (error) {
      console.error(error);
      alert("❌ Failed to update product.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-5xl px-6">

        <h1 className="text-5xl font-black">
          Edit Product
        </h1>

        <p className="mt-3 text-zinc-400">
          Update your existing product.
        </p>

        <div className="mt-12 space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

                  {/* Basic Info */}

          <div className="grid gap-6 md:grid-cols-2">

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product Title"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Product Slug"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Product Description"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Pricing */}

          <div className="grid gap-6 md:grid-cols-2">

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

            <input
              name="comparePrice"
              type="number"
              value={formData.comparePrice}
              onChange={handleChange}
              placeholder="Compare Price"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

          </div>

          {/* Category */}

          <div className="grid gap-6 md:grid-cols-2">

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

            <input
              name="collection"
              value={formData.collection}
              onChange={handleChange}
              placeholder="Collection"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

          </div>

          {/* Stock */}

          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Images */}

          <textarea
            name="images"
            rows={3}
            value={formData.images}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Sizes */}

          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Sizes (S,M,L,XL)"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Colors */}

          <input
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Colors (Black,White,Blue)"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

                    {/* Product Flags */}

          <div className="grid gap-6 md:grid-cols-2">

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4">

              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              <span>Featured Product</span>

            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4">

              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
              />

              <span>Bestseller</span>

            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4">

              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />

              <span>New Arrival</span>

            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4">

              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />

              <span>Active Product</span>

            </label>

          </div>

          <button
            type="button"
            onClick={handleUpdate}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02]"
          >
            Update Product
          </button>

        </div>

      </div>

    </main>
  );
}