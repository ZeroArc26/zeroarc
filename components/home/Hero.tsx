import HeroText from "./HeroText";
import HeroImage from "./HeroImage";
import Container from "@/components/layout/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B]">
      {/* Background Glow */}
      <div className="absolute left-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[150px]" />

      <div className="absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

      <Container className="relative flex min-h-screen flex-col items-center justify-between gap-16 pt-32 pb-16 lg:flex-row">
        {/* Left */}
        <HeroText />

        {/* Right */}
        <HeroImage />
      </Container>
    </section>
  );
}