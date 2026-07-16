import Hero from "@/components/home/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";

export default function Home() {
  return (
    <main className="bg-[#09090B] text-white">
      <Hero />
      <FeaturedCollection />
    </main>
  );
}