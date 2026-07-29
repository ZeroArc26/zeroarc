"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import slugify from "slugify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

interface ParentCategory {
  _id: string;
  name: string;
}

interface BasicInfoSectionProps {
  form: UseFormReturn<CategoryFormValues>;
  parentCategories?: ParentCategory[];
}

export default function BasicInfoSection({
  form,
  parentCategories = [],
}: BasicInfoSectionProps) {
  const manualSlug = useRef(false);

  const name = form.watch("name");
  const description = form.watch("description") || "";

  useEffect(() => {
    if (manualSlug.current) return;

    form.setValue(
      "slug",
      slugify(name || "", {
        lower: true,
        strict: true,
        trim: true,
      }),
      {
        shouldValidate: true,
      }
    );
  }, [name, form]);

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Provide the essential details for this category.
        </p>
      </div>

      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Category Name
          <span className="ml-1 text-destructive">*</span>
        </Label>

        <Input
          id="name"
          placeholder="Anime T-Shirts"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">
          Slug
        </Label>

        <Input
          id="slug"
          placeholder="anime-t-shirts"
          {...form.register("slug")}
          onChange={(e) => {
            manualSlug.current = true;

            form.setValue(
              "slug",
              e.target.value,
              {
                shouldValidate: true,
              }
            );
          }}
        />

        <p className="text-xs text-muted-foreground">
          Used in the category URL.
        </p>

        {form.formState.errors.slug && (
          <p className="text-sm text-destructive">
            {form.formState.errors.slug.message}
          </p>
        )}
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label>
          Parent Category
        </Label>

        <Select
          value={form.watch("parentCategory") ?? "none"}
          onValueChange={(value) =>
            form.setValue(
              "parentCategory",
              value === "none" ? null : value,
              {
                shouldValidate: true,
              }
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Parent Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">
              None
            </SelectItem>

            {parentCategories.map((category) => (
              <SelectItem
                key={category._id}
                value={category._id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          Leave empty for a top-level category.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={5}
          placeholder="Write category description..."
          {...form.register("description")}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Optional</span>

          <span>{description.length}/1000</span>
        </div>

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}