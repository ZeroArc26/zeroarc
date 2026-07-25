import type { Metadata } from "next";

import Sidebar from "@/components/admin/layout/Sidebar";
import Navbar from "@/components/admin/layout/Navbar";

export const metadata: Metadata = {
  title: "ZeroArc Admin",
  description: "ZeroArc Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}