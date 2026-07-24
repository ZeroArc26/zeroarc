import NavbarServer from "@/components/layout/NavbarServer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarServer />
      {children}
    </>
  );
}