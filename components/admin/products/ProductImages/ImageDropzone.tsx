"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGES,
  generateImageId,
  getImageDimensions,
  compressImage,
} from "./image-utils";

import type { ProductImage } from "./image-types";

interface Props {
  color: string;
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

export default function ImageDropzone({
  color,
  images,
  setImages,
}: Props) {
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (images.length + acceptedFiles.length > MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      rejectedFiles.forEach((file) => {
        const error = file.errors?.[0];

        if (!error) return;

        if (error.code === "file-too-large") {
          toast.error(`${file.file.name} is larger than 5MB.`);
        }

        if (error.code === "file-invalid-type") {
          toast.error(`${file.file.name} is not a supported image.`);
        }
      });

      const newImages: ProductImage[] = await Promise.all(
        acceptedFiles.map(async (rawFile, index) => {
          const file = await compressImage(rawFile);
          const preview = URL.createObjectURL(file);

          const { width, height } = await getImageDimensions(file);

          return {
            id: generateImageId(),

            color,

            file,
            preview,

            width,
            height,

            isCover: images.length === 0 && index === 0,

            status: "idle",

            uploaded: false,

            progress: 0,

            size: file.size,

            type: file.type,
          };
        })
      );

      setImages((prev) => [...prev, ...newImages]);
    },
    [color, images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    maxFiles: MAX_IMAGES,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <ImagePlus size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Product Images
          </h2>

          <p className="text-sm text-zinc-400">
            Upload high-quality product images.
          </p>
        </div>
      </div>

      <div className="my-8 h-px bg-gradient-to-r from-violet-500/30 via-zinc-800 to-transparent" />

      <div
        {...getRootProps()}
        className={`group cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragActive
            ? "border-violet-500 bg-violet-500/10"
            : "border-zinc-700 hover:border-violet-500 hover:bg-violet-500/5"
        }`}
      >
        <input {...getInputProps()} />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 transition group-hover:scale-110">
          <UploadCloud size={36} />
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          {isDragActive
            ? "Drop images here"
            : "Drag & Drop Product Images"}
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          PNG • JPG • WEBP • AVIF
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Maximum {MAX_IMAGES} images • 5MB each
        </p>

        <button
          type="button"
          className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"
        >
          Browse Files
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          {images.length} / {MAX_IMAGES} uploaded
        </span>

        <span className="text-zinc-500">
          First image becomes cover automatically
        </span>
      </div>
    </div>
  );
}