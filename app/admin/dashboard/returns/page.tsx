import PageHeader from "@/components/admin/shared/PageHeader";
import ReturnsInbox from "@/components/admin/returns/ReturnsInbox";

export default function AdminReturnsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Returns & Refunds"
        description="All customer return requests in one place. Open an order to approve, schedule pickup or refund."
      />

      <ReturnsInbox />
    </div>
  );
}
