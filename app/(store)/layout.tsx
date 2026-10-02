import LiveChatWidget from "@/components/chat/LiveChatWidget";
import WhatsAppFloatButton from "@/components/layout/WhatsAppFloatButton";
import TicketNotifier from "@/components/chat/TicketNotifier";


export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <LiveChatWidget />
      <WhatsAppFloatButton />
      <TicketNotifier />
    </>
  );
}