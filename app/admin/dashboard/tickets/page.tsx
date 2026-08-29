import PageHeader from "@/components/admin/shared/PageHeader";
import TicketsInbox from "@/components/admin/tickets/TicketsInbox";

export default function AdminTicketsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Support Tickets"
        description="Raised automatically when the live chat bot couldn't resolve a customer's issue."
      />

      <TicketsInbox />
    </div>
  );
}
