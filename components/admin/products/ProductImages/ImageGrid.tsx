"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import ImageCard from "./ImageCard";
import type { ProductImage } from "./image-types";

interface Props {
  color: string;
  images: ProductImage[];
  setImages: Dispatch<SetStateAction<ProductImage[]>>;
  onPreview: (image: ProductImage) => void;
}

export default function ImageGrid({
  color,
  images,
  setImages,
  onPreview,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setImages((allImages) => {
      const currentImages = allImages.filter(
        (img) => img.color === color
      );

      const otherImages = allImages.filter(
        (img) => img.color !== color
      );

      const oldIndex = currentImages.findIndex(
        (img) => img.id === active.id
      );

      const newIndex = currentImages.findIndex(
        (img) => img.id === over.id
      );

      const reordered = arrayMove(
        currentImages,
        oldIndex,
        newIndex
      ).map((img, index) => ({
        ...img,
        isCover: index === 0,
      }));

      return [...otherImages, ...reordered];
    });
  }

  function deleteImage(id: string) {
    setImages((allImages) => {
      const currentImages = allImages.filter(
        (img) => img.color === color
      );

      const otherImages = allImages.filter(
        (img) => img.color !== color
      );

      const filtered = currentImages
        .filter((img) => img.id !== id)
        .map((img, index) => ({
          ...img,
          isCover: index === 0,
        }));

      return [...otherImages, ...filtered];
    });
  }

  function setCover(id: string) {
    setImages((allImages) => {
      const currentImages = allImages.filter(
        (img) => img.color === color
      );

      const otherImages = allImages.filter(
        (img) => img.color !== color
      );

      const cover = currentImages.find(
        (img) => img.id === id
      );

      if (!cover) return allImages;

      const remaining = currentImages.filter(
        (img) => img.id !== id
      );

      return [
        ...otherImages,
        {
          ...cover,
          isCover: true,
        },
        ...remaining.map((img) => ({
          ...img,
          isCover: false,
        })),
      ];
    });
  }

  if (images.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Uploaded Images
          </h3>

          <p className="text-sm text-zinc-500">
            Drag images to reorder them.
          </p>
        </div>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
          {images.length} Images
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={deleteImage}
                onSetCover={setCover}
                onPreview={onPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}