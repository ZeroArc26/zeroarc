import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <LiveChatWidget />
    </>
  );
}