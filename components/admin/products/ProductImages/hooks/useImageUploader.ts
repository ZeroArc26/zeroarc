"use client";

import { useState } from "react";

import type { ProductImage } from "../image-types";

export function useProductImages() {
  const [images, setImages] = useState<ProductImage[]>([]);

  const [previewImage, setPreviewImage] =
    useState<ProductImage | null>(null);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  function openPreview(image: ProductImage) {
    setPreviewImage(image);
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);

    setTimeout(() => {
      setPreviewImage(null);
    }, 200);
  }

  function getImagesByColor(color: string) {
    return images.filter(
      (image) => image.color === color
    );
  }

  return {
    images,
    setImages,

    previewImage,
    previewOpen,

    openPreview,
    closePreview,

    setPreviewImage,

    getImagesByColor,
  };
}