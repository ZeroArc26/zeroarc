"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Layers3,
  Star,
  Hash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Separator } from "@/components/ui/separator";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

interface PublishSectionProps {
  form: UseFormReturn<CategoryFormValues>;
}

export default function PublishSection({
  form,
}: PublishSectionProps) {
  const {
    watch,
    setValue,
    register,
  } = form;

  const name = watch("name");
  const slug = watch("slug");
  const status = watch("status");
  const featured = watch("featured");
  const parentCategory = watch("parentCategory");

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Layers3 className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle>
                Publish
              </CardTitle>

              <CardDescription>
                Manage how this category appears
                across your store.
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary">
            Visibility
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">

        {/* Status */}

        <div className="space-y-3">
          <Label>
            Category Status
          </Label>

          <Select
            value={status}
            onValueChange={(value) =>
              setValue(
                "status",
                value as
                  | "draft"
                  | "published"
                  | "archived",
                {
                  shouldDirty: true,
                }
              )
            }
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="draft">
                Draft
              </SelectItem>

              <SelectItem value="published">
                Published
              </SelectItem>

              <SelectItem value="archived">
                Archived
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">
            Draft categories stay hidden until published.
          </p>
        </div>

        {/* Featured */}

        <div className="flex items-center justify-between rounded-2xl border p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />

              <Label>
                Featured Category
              </Label>
            </div>

            <p className="text-sm text-muted-foreground">
              Highlight this category on the storefront.
            </p>
          </div>

          <Switch
            checked={featured}
            onCheckedChange={(checked) =>
              setValue("featured", checked, {
                shouldDirty: true,
              })
            }
          />
        </div>

        {/* Sort Order */}

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Sort Order
          </Label>

          <Input
            type="number"
            min={0}
            placeholder="0"
            className="h-11 rounded-xl"
            {...register("sortOrder", {
              valueAsNumber: true,
            })}
          />

          <p className="text-sm text-muted-foreground">
            Lower numbers appear first in your category list.
          </p>
        </div>

        <Separator />

                {/* Publishing Tips */}

        <div className="space-y-4 rounded-2xl border bg-muted/20 p-5">
          <h3 className="text-base font-semibold">
            Publishing Tips
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use a clear and unique category name.</li>
            <li>• Upload a representative category image.</li>
            <li>• Publish only when the category is ready.</li>
            <li>• Featured categories appear prominently.</li>
          </ul>
        </div>

        <Separator />

        {/* Summary */}

        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Category Summary
          </h3>

          <div className="rounded-2xl border">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <span className="text-sm text-muted-foreground">
                Name
              </span>

              <span className="max-w-[220px] truncate font-medium">
                {name || "-"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b px-5 py-4">
              <span className="text-sm text-muted-foreground">
                Slug
              </span>

              <Badge variant="secondary">
                {slug || "-"}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b px-5 py-4">
              <span className="text-sm text-muted-foreground">
                Parent Category
              </span>

              <span className="font-medium">
                {parentCategory || "None"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b px-5 py-4">
              <span className="text-sm text-muted-foreground">
                Status
              </span>

              <Badge
                variant={
                  status === "published"
                    ? "default"
                    : status === "draft"
                    ? "secondary"
                    : "outline"
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-muted-foreground">
                Featured
              </span>

              <Badge
                variant={featured ? "default" : "outline"}
              >
                {featured ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}