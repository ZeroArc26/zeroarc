"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations/category.schema";

import BasicInfoSection from "./sections/BasicInfoSection";
import ImageSection from "./sections/ImageSection";
import PublishSection from "./sections/PublishSection";

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;

  onSubmit: (
    values: CategoryFormValues
  ) => Promise<void> | void;

  isSubmitting?: boolean;

  mode?: "create" | "edit";

  onCancel?: () => void;
}

export default function CategoryForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  onCancel,
}: CategoryFormProps) {
  const initialValues = useMemo<CategoryFormValues>(
    () => ({
      name: "",
      slug: "",
      description: "",
      image: {
        url: "",
        alt: "",
      },
      parentCategory: null,
      featured: false,
      status: "draft",
      sortOrder: 0,
      seo: {
        metaTitle: "",
        metaDescription: "",
        index: true,
      },
      ...defaultValues,
    }),
    [defaultValues]
  );

  const form = useForm<CategoryFormValues>({
  defaultValues: initialValues,
  mode: "onChange",
  resolver: zodResolver(categorySchema) as never,
});

  const handleSubmit = async (
    values: CategoryFormValues
  ) => {
    await onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid gap-8 xl:grid-cols-3">
          {/* Left Column */}

          <div className="space-y-8 xl:col-span-2">
            <BasicInfoSection
              form={form}
            />

            <ImageSection
              form={form}
            />
          </div>

          {/* Right Column */}

          <div className="space-y-8">

                        <PublishSection
              form={form}
            />
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              if (onCancel) {
                onCancel();
                return;
              }

              form.reset(initialValues);
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              isSubmitting || !form.formState.isValid
            }
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Category"
              : "Update Category"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}