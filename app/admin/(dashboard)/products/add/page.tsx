"use client";

import { useState } from "react";

export default function AddProductPage() {

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",

    price: "",
    comparePrice: "",

    category: "",
    collectionName: "",

    stock: "",

    featured: false,
    bestseller: false,
    newArrival: false,

    active: true,

    images: "",
    sizes: "",
    colors: "",
  });

  const [uploading, setUploading] = useState(false);

const [preview, setPreview] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
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

  async function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  try {
    const form = new FormData();

    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Upload failed");
    }

    setPreview(data.imageUrl);

    setFormData((prev) => ({
      ...prev,
      images: data.imageUrl,
    }));

  } catch (error) {
    console.error(error);

    alert("Image upload failed.");
  } finally {
    setUploading(false);
  }
}

  async function handleSubmit() {
  if (
    !formData.title ||
    !formData.slug ||
    !formData.description ||
    !formData.price ||
    !formData.category ||
    !formData.collectionName
  ) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    const res = await fetch("/api/products", {
      method: "POST",
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
        collectionName: formData.collectionName,

        stock: Number(formData.stock),

        images: formData.images
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean),

        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        colors: formData.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        featured: formData.featured,
        bestseller: formData.bestseller,
        newArrival: formData.newArrival,
        active: formData.active,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to create product");
    }

    alert("✅ Product Added Successfully!");

    setFormData({
      title: "",
      slug: "",
      description: "",

      price: "",
      comparePrice: "",

      category: "",
      collectionName: "",

      stock: "",

      featured: false,
      bestseller: false,
      newArrival: false,

      active: true,

      images: "",
      sizes: "",
      colors: "",
    });

  } catch (error) {
    console.error(error);
    alert("❌ Failed to create product.");
  }
}

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-5xl px-6">

        <h1 className="text-5xl font-black">
          Add Product
        </h1>

        <p className="mt-3 text-zinc-400">
          Create a new product.
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
            placeholder="Product Description"
            rows={5}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Pricing */}

          <div className="grid gap-6 md:grid-cols-2">

            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

            <input
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleChange}
              placeholder="Compare Price"
              type="number"
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
              value={formData.collectionName}
              onChange={handleChange}
              placeholder="Collection"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
            />

          </div>

          {/* Inventory */}

          <input
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Total Stock"
            type="number"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-violet-500"
          />

          {/* Images */}

<div className="space-y-4">

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4"
  />

  {uploading && (
    <p className="text-yellow-400 font-semibold">
      Uploading Image...
    </p>
  )}

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="h-64 w-full rounded-xl object-cover border border-zinc-700"
    />
  )}

  <input
    type="text"
    name="images"
    value={formData.images}
    readOnly
    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-zinc-400"
  />

</div>

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
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02]"
          >
            Save Product
          </button>

        </div>
        </div>
    </main>
  );
}