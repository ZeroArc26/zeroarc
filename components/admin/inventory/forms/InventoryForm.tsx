"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  inventoryFormSchema,
  type InventoryFormInput,
} from "@/validators/inventoryForm";

type InventoryFormValues = InventoryFormInput;

interface InventoryFormProps {
  mode: "create" | "edit";

  defaultValues?: {
    warehouse?: string;
    sku?: string;
    availableStock?: number;
    reservedStock?: number;
    incomingStock?: number;
    lowStockThreshold?: number;
    productId?: string;
    variantId?: string;
  };

  onSubmit?: (
    values: InventoryFormValues
  ) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;
}


export default function InventoryForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: InventoryFormProps) {

    const form = useForm<InventoryFormValues>({
  resolver: zodResolver(inventoryFormSchema),

  defaultValues: {
    warehouse: defaultValues?.warehouse ?? "Main Warehouse",
    sku: defaultValues?.sku ?? "",
    availableStock: defaultValues?.availableStock ?? 0,
    reservedStock: defaultValues?.reservedStock ?? 0,
    incomingStock: defaultValues?.incomingStock ?? 0,
    lowStockThreshold: defaultValues?.lowStockThreshold ?? 5,
    productId: defaultValues?.productId ?? "",
    variantId: defaultValues?.variantId ?? "",
  },

  mode: "onChange",
});

const handleSubmit = async (
  values: InventoryFormValues
) => {
  try {
    await onSubmit?.(values);

    if (mode === "create") {
      form.reset();
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
  <Form {...form}>
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(handleSubmit)}
    >

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormField
  control={form.control}
  name="productId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product ID</FormLabel>

      <FormControl>
        <Input
          placeholder="Enter Product ID"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="variantId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Variant ID</FormLabel>

      <FormControl>
        <Input
          placeholder="Enter Variant ID"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="warehouse"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Warehouse</FormLabel>

      <FormControl>
        <Input
          placeholder="Enter warehouse"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="sku"
  render={({ field }) => (
    <FormItem>
      <FormLabel>SKU</FormLabel>

      <FormControl>
        <Input
          placeholder="Enter SKU"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="availableStock"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Available Stock</FormLabel>

      <FormControl>
        <Input
          type="number"
          value={field.value}
          onChange={(e) =>
            field.onChange(Number(e.target.value))
          }
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="reservedStock"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Reserved Stock</FormLabel>

      <FormControl>
        <Input
          type="number"
          value={field.value}
          onChange={(e) =>
            field.onChange(Number(e.target.value))
          }
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="incomingStock"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Incoming Stock</FormLabel>

      <FormControl>
        <Input
          type="number"
          value={field.value}
          onChange={(e) =>
            field.onChange(Number(e.target.value))
          }
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

  <FormField
  control={form.control}
  name="lowStockThreshold"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Low Stock Threshold</FormLabel>

      <FormControl>
        <Input
          type="number"
          value={field.value}
          onChange={(e) =>
            field.onChange(Number(e.target.value))
          }
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

</div>

<div className="flex justify-end gap-3 pt-4">

      <Button
  type="button"
  variant="outline"
  onClick={onCancel}
>
  Cancel
</Button>

  <Button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting
    ? mode === "create"
      ? "Saving..."
      : "Updating..."
    : mode === "create"
      ? "Save Inventory"
      : "Update Inventory"}
</Button>
</div>
    </form>
  </Form>
);
}