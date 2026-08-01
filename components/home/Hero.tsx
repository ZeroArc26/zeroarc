import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[800px] h-[calc(100vh-120px)] overflow-hidden bg-black text-white">

      {/* Background */}

      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      </div>

      {/* Main Container */}

      <div className="relative z-10 mx-auto flex h-full max-w-[1700px] px-10 xl:px-20">

        {/* ================= LEFT ================= */}

        <div className="flex w-[45%] items-center justify-start pb-12">

          <div className="max-w-[720px]">

            {/* Japanese */}

            <p className="mb-6 -mt-20 text-[22px] tracking-[0.28em] text-violet-500">
              次の物語を、着よう
            </p>

            {/* Heading */}

            <h1
              className="
                font-[family:var(--font-space)]
                uppercase
                font-bold
                leading-[0.84]
                tracking-[-0.08em]
                text-[clamp(7.2rem,8vw,10.5rem)]
              "
            >
              WEAR YOUR
              <br />
              NEXT ARC
            </h1>

            {/* Description */}

            <p className="mt-6 max-w-[520px] text-[23px] leading-[2.1rem] text-zinc-300">
              Premium streetwear inspired by anime,
              <br />
              culture and limitless imagination.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex gap-6">

              <button className="rounded-xl bg-violet-600 px-12 py-5 text-sm font-semibold tracking-[0.08em] transition hover:bg-violet-500">
                SHOP MEN →
              </button>

              <button className="rounded-xl border border-zinc-600 px-12 py-5 text-sm font-semibold tracking-[0.08em] transition hover:bg-white hover:text-black">
                SHOP WOMEN →
              </button>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="relative flex w-[55%] items-center justify-center">

          <div
            className="
              relative
              h-full
              w-full
              flex
              items-center
              justify-center
            "
          >

            <Image
  src="/images/hero/featured-shirt.png"
  alt="ZeroArc Featured"
  width={1200}
  height={1200}
  priority
  className="
    w-[1750px]
    max-w-none
    object-contain
    translate-x-12
    -translate-y-10
    drop-shadow-[0_70px_160px_rgba(168,85,247,0.55)]
    pointer-events-none
    select-none
  "
/>

          </div>

        </div>

      </div>

      {/* Bottom Fade */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />

    </section>
  );
}