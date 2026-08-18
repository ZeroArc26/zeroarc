"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/lib/validations/product.schema";

import { Button } from "@/components/ui/button";

import { uploadImage } from "./services/upload.service";

import ImageDropzone from "./ImageDropzone";
import ImageGrid from "./ImageGrid";
import ImagePreviewModal from "./ImagePreviewModal";

import { useProductImages } from "./hooks/useImageUploader";
import type { ProductImage } from "./image-types";

export default function ProductImages() {
  const {
  watch,
  setValue,
  getValues,
} = useFormContext<ProductFormValues>();

// Seed local upload state from any images this product already has
// saved (edit mode) — computed once, on first render only, so it
// doesn't clobber in-progress local edits on every re-render.
const [initialImages] = useState<ProductImage[]>(() =>
  (getValues("images") || []).map((img, index) => ({
    id: crypto.randomUUID(),
    color: img.color || "Default",
    preview: img.url,
    url: img.url,
    isCover: img.isCover ?? index === 0,
    status: "uploaded" as const,
    progress: 100,
    uploaded: true,
    size: 0,
    type: "",
  }))
);

const {
  images,
  setImages,

  previewImage,
  previewOpen,

  openPreview,
  closePreview,

  setPreviewImage,

  getImagesByColor,
} = useProductImages(initialImages);

const variants = watch("variants") ?? [];

const colors =
  variants.length > 0
    ? [
        ...new Set(
          variants
            .map((variant) => variant.color.trim())
            .filter(Boolean)
        ),
      ]
    : [];

useEffect(() => {
  const uploadedImages = images
    .filter((image) => image.uploaded && image.url)
    .map((image, index) => ({
      url: image.url!,
      color: image.color,
      alt: "",
      isCover: image.isCover,
      order: index,
    }));

  setValue("images", uploadedImages);
}, [images, setValue]);

  async function uploadImages() {
    for (const image of images) {
      if (image.uploaded || !image.file) continue;

      const file = image.file;

      setImages((prev) =>
        prev.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: "uploading",
              }
            : item
        )
      );

      const result = await uploadImage(
        file,
        (progress) => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === image.id
                ? {
                    ...item,
                    progress,
                  }
                : item
            )
          );
        }
      );

      setImages((prev) =>
        prev.map((item) =>
          item.id === image.id
            ? {
                ...item,
                uploaded: true,
                progress: 100,
                status: "uploaded",
                url: result.url,
              }
            : item
        )
      );
    }
  }

  return (
    <>
      <div className="space-y-8">

        {colors.length === 0 && (
  <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center">
    <h3 className="text-lg font-semibold text-white">
      No Variants Generated
    </h3>

    <p className="mt-2 text-sm text-zinc-400">
      Generate product variants first to upload color-wise images.
    </p>
  </div>
)}

      {colors.map((color) => (
  <div
    key={color}
    className="space-y-8"
  >
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-white">
        {color}
      </h3>

      <p className="text-sm text-muted-foreground">
        Upload images for the{" "}
        {color} variant.
      </p>
    </div>

    <ImageDropzone
      color={color}
      images={images}
      setImages={setImages}
    />

    <ImageGrid
      color={color}
      images={getImagesByColor(color)}
      setImages={setImages}
      onPreview={openPreview}
    />
  </div>
))}

        {images.length > 0 && (
          <Button
            onClick={uploadImages}
            className="w-full rounded-2xl"
            disabled={
              images.length === 0 ||
              images.every((image) => image.uploaded)
            }
          >
            Upload Images
          </Button>
        )}
      </div>

      <ImagePreviewModal
        open={previewOpen}
        image={previewImage}
        images={images}
        onClose={closePreview}
        onChangeImage={setPreviewImage}
      />
    </>
  );
}