"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Crown,
  GripVertical,
  Trash2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ProductImage } from "./image-types";
import { formatFileSize } from "./image-utils";

interface Props {
  image: ProductImage;
  onDelete: (id: string) => void;
  onSetCover: (id: string) => void;
  onPreview: (image: ProductImage) => void;
}

export default function ImageCard({
  image,
  onDelete,
  onSetCover,
  onPreview,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition-all duration-300 ${
        isDragging
          ? "scale-[1.03] border-violet-500 shadow-2xl shadow-violet-500/20"
          : "hover:border-violet-500/30"
      }`}
    >
      {/* Image */}

      <div
  className="relative aspect-square cursor-zoom-in"
  onClick={() => onPreview(image)}
>
        <Image
          src={image.uploaded && image.url ? image.url : image.preview}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Drag Handle */}

        <button
  onClick={(e) => e.stopPropagation()}
  {...listeners}
  {...attributes}
          className="absolute left-3 top-3 rounded-xl bg-black/60 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
        >
          <GripVertical size={18} />
        </button>

        {/* Delete */}

        <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete(image.id);
  }}
          className="absolute right-3 top-3 rounded-xl bg-red-500 p-2 text-white opacity-0 transition group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>

        {/* Cover Badge */}

        {image.isCover && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <Crown size={14} />
            Cover Image
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="truncate text-zinc-300">
            {image.file.name}
          </span>

          <span className="text-zinc-500">
            {formatFileSize(image.size)}
          </span>
        </div>

        {/* Upload Progress */}

        {!image.uploaded ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span>Waiting Upload</span>

              <span>{image.progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{
                  width: `${image.progress}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <Check size={16} />
            Uploaded Successfully
          </div>
        )}

        {/* Cover Button */}

        {!image.isCover && (
          <Button
  variant="outline"
  onClick={(e) => {
    e.stopPropagation();
    onSetCover(image.id);
  }}
            className="w-full rounded-xl border-zinc-700 bg-transparent hover:border-violet-500 hover:bg-violet-500/10"
          >
            <Crown className="mr-2 h-4 w-4" />
            Set as Cover
          </Button>
        )}
      </div>
    </div>
  );
}