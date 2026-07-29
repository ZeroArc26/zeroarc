"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/lib/validations/product.schema";

import { Button } from "@/components/ui/button";

import { uploadImage } from "./services/upload.service";

import ImageDropzone from "./ImageDropzone";
import ImageGrid from "./ImageGrid";
import ImagePreviewModal from "./ImagePreviewModal";

import { useProductImages } from "./hooks/useProductImages";

export default function ProductImages() {
  const {
  watch,
  setValue,
} = useFormContext<ProductFormValues>();

const {
  images,
  setImages,

  previewImage,
  previewOpen,

  openPreview,
  closePreview,

  setPreviewImage,

  getImagesByColor,
} = useProductImages();

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
    : ["Black", "White", "Beige"];

    console.log("Variants:", variants);
console.log("Colors:", colors);

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
      if (image.uploaded) continue;

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
        image.file,
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