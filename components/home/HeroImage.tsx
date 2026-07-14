import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Purple Glow */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-3xl" />

      {/* Hero Image */}
      <Image
        src="/images/hero/hero.png"
        alt="ZeroArc Hero T-Shirt"
        width={520}
        height={520}
        priority
        className="relative z-10 object-contain transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}