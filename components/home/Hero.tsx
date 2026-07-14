import HeroText from "./HeroText";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B]">
      {/* Background Glow */}
      <div className="absolute left-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[150px]" />

      <div className="absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-16 px-6 pt-32 pb-16 lg:flex-row">
        {/* Left */}
        <HeroText />

        {/* Right */}
        <HeroImage />
      </div>
    </section>
  );
}