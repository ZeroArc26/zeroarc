"use client";

import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  createPreview,
  revokePreview,
  validateImage,
} from "./image-utils";

interface ImageSectionProps {
  form: UseFormReturn<CategoryFormValues>;
}

export default function ImageSection({
  form,
}: ImageSectionProps) {
  const [preview, setPreview] = useState(
    form.watch("image.url") || ""
  );

  const onDrop = useCallback(
  async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      const error = validateImage(file);

      if (error) {
        form.setError("image.url", {
          type: "manual",
          message: error,
        });

        return;
      }

      form.clearErrors("image.url");

      if (preview) {
        revokePreview(preview);
      }

      const imagePreview = createPreview(file);

setPreview(imagePreview);


// Upload to ImageKit

const uploadData = new FormData();

uploadData.append(
  "file",
  file
);


const response = await fetch(
  "/api/upload",
  {
    method: "POST",
    body: uploadData,
  }
);


const result = await response.json();


if (!response.ok) {
  throw new Error(
    result.error || "Upload failed"
  );
}


// Save ImageKit URL

form.setValue(
  "image",
  {
    url: result.url,
    alt: file.name,
  },
  {
    shouldDirty: true,
    shouldValidate: true,
  }
);
    },
    [form, preview]
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_TYPES,
  });

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        revokePreview(preview);
      }
    };
  }, [preview]);

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle>
                Category Image
              </CardTitle>

              <CardDescription>
                Upload a representative image for this
                category.
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary">
            Single Image
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div
          {...getRootProps()}
          className={`
            rounded-2xl
            border-2
            border-dashed
            p-10
            transition-all

            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center text-center">
            <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              {isDragActive
                ? "Drop image here"
                : "Drag & Drop Image"}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              or browse from your computer
            </p>

            <Button
              type="button"
              className="mt-6"
              onClick={open}
            >
              Choose Image
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              JPG • PNG • WEBP • Max 5 MB
            </p>
          </div>
        </div>
                {preview && (
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="overflow-hidden rounded-xl border">
                <img
                  src={preview}
                  alt={form.watch("image.alt") || "Category"}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Image Preview
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      This image will be displayed for the category.
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        File Name
                      </span>

                      <span className="max-w-[220px] truncate text-sm font-medium">
                        {form.watch("image.alt")}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>

                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                        Ready
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={open}
                  >
                    Replace Image
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (preview.startsWith("blob:")) {
                        revokePreview(preview);
                      }

                      setPreview("");

                      form.setValue(
                        "image",
                        {
                          url: "",
                          alt: "",
                        },
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );

                      form.clearErrors("image.url");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {form.formState.errors.image?.url && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.image.url.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}