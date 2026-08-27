import PageHeader from "@/components/admin/shared/PageHeader";
import ManualOrderForm from "@/components/admin/orders/ManualOrderForm";

export default function ManualOrderPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Manual Order"
        description="Create an order for a customer who ordered via WhatsApp, Instagram, or in person with a custom design — decrements stock and generates a real invoice/shipping label like any online order."
      />

      <ManualOrderForm />
    </div>
  );
}
