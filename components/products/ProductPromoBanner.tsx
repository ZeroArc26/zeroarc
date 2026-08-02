import Image from "next/image";

export default function ProductPromoBanner() {
  return (
    <div className="relative flex h-full min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl bg-black px-8 py-8">
      {/* Layered art */}
      <div className="pointer-events-none absolute -right-10 bottom-0 h-[240px] w-[240px] opacity-90">
        <Image
          src="/images/hero/hero-ring.png"
          alt=""
          fill
          className="object-contain"
        />
        <Image
          src="/images/hero/hero-model-2.png"
          alt=""
          fill
          className="object-contain object-bottom"
        />
      </div>

      <div className="relative z-10 max-w-[220px]">
        <h3 className="font-[family:var(--font-space)] text-xl font-black uppercase leading-tight text-white">
          The Arc Continues.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Each piece is a chapter. You&apos;re the protagonist.
        </p>
      </div>
    </div>
  );
}