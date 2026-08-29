import PageHeader from "@/components/admin/shared/PageHeader";
import ChatInbox from "@/components/admin/chat/ChatInbox";

export default function AdminChatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Chat"
        description="Real-time conversations with logged-in customers."
      />

      <ChatInbox />
    </div>
  );
}
