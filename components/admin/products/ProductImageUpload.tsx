"use client";

import { ChangeEvent } from "react";

type ProductImageUploadProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ProductImageUpload({
  images,
  onChange,
}: ProductImageUploadProps) {
  const handleImageSelect = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    const previews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    onChange([...images, ...previews]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter(
      (_, i) => i !== index
    );

    onChange(updatedImages);
  };

  return (
    <section>
      <h3 className="mb-6 text-xl font-semibold">
        Product Images
      </h3>

      <div className="rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

        <input
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />

        <div className="space-y-3">
          <p className="text-lg font-medium">
            📷 Upload Product Images
          </p>

          <p className="text-sm text-zinc-400">
            Drag & Drop or Click to Upload
          </p>

          <label
            htmlFor="product-images"
            className="inline-block cursor-pointer rounded-lg bg-violet-600 px-5 py-2 text-white transition hover:bg-violet-500"
          >
            Choose Images
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-zinc-700"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="h-40 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}