"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";

import type { ProductImage } from "./image-types";
import { formatFileSize } from "./image-utils";

interface Props {
  open: boolean;
  image: ProductImage | null;
  images: ProductImage[];

  onClose: () => void;
  onChangeImage: (image: ProductImage | null) => void;
}

export default function ImagePreviewModal({
  open,
  image,
  images,
  onClose,
  onChangeImage,
}: Props) {
  const currentIndex = useMemo(() => {
    if (!image) return -1;

    return images.findIndex((i) => i.id === image.id);
  }, [image, images]);

  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex !== -1 &&
    currentIndex < images.length - 1;

  function previousImage() {
    if (!hasPrevious) return;

    onChangeImage(images[currentIndex - 1]);
  }

  function nextImage() {
    if (!hasNext) return;

    onChangeImage(images[currentIndex + 1]);
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowLeft":
          previousImage();
          break;

        case "ArrowRight":
          nextImage();
          break;
      }
    }

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    currentIndex,
    images,
  ]);

  if (!image) return null;
    return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex h-full w-full flex-col"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950/70 px-8 py-5 backdrop-blur-xl">
              <div>
                <h2 className="truncate text-lg font-semibold text-white">
                  {image.file.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-zinc-300 transition hover:border-violet-500 hover:bg-violet-500/10 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* Image */}

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-16 py-10">
              <motion.div
                key={image.id}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="relative h-full w-full"
              >
                <Image
                  src={image.preview}
                  alt={image.file.name}
                  fill
                  unoptimized
                  priority
                  className="object-contain"
                />
                
                            </motion.div>

              {/* Previous */}

              {hasPrevious && (
                <button
                  onClick={previousImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-xl transition hover:border-violet-500 hover:bg-violet-500/20"
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              {/* Next */}

              {hasNext && (
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-xl transition hover:border-violet-500 hover:bg-violet-500/20"
                >
                  <ChevronRight size={26} />
                </button>
              )}
            </div>

            {/* Footer */}

            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 bg-zinc-950/70 px-8 py-5 backdrop-blur-xl">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">
                  {image.file.name}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <span>{formatFileSize(image.size)}</span>

                  {image.width && image.height && (
                    <span>
                      {image.width} × {image.height}
                    </span>
                  )}

                  <span>{image.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {image.isCover && (
                  <div className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
                    <Crown size={16} />
                    Cover Image
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}