import PageHeader from "@/components/admin/shared/PageHeader";
import POSTerminal from "@/components/admin/pos/POSTerminal";

export default function POSPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Offline Sale (POS)"
        description="Scan a product barcode, pick color/size, and check out an in-store customer."
      />

      <POSTerminal />
    </div>
  );
}
