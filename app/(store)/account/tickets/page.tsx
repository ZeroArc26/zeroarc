import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import MyTicketsClient from "@/components/account/MyTicketsClient";

export default function MyTicketsPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-black uppercase text-black">
                My Support Tickets
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Raised from Live Chat when your issue needed extra follow-up.
              </p>
            </div>

            <MyTicketsClient />
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}
