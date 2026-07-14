import { SITE } from "@/constants/site";
import HeroButtons from "./HeroButtons";

export default function HeroText() {
  return (
    <div className="max-w-xl">
      {/* Badge */}
      <span className="inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
        {SITE.badge}
      </span>

      {/* Brand */}
      <h1 className="mt-6 text-6xl font-black uppercase tracking-[0.15em] text-white md:text-8xl">
        {SITE.name}
      </h1>

      {/* Tagline */}
      <h2 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
        Wear Your <br />
        <span className="bg-gradient-to-r from-purple-400 to-fuchsia-600 bg-clip-text text-transparent">
          Next Story.
        </span>
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
        {SITE.description}
      </p>

      {/* Buttons */}
      <div className="mt-10">
        <HeroButtons />
      </div>

      {/* Rating */}
      <div className="mt-10 flex items-center gap-4">
        <div className="text-yellow-400 text-lg">
          {SITE.rating.stars}
        </div>

        <div>
          <p className="font-semibold text-white">
            {SITE.rating.score}
          </p>

          <p className="text-sm text-zinc-500">
            {SITE.rating.reviews}
          </p>
        </div>
      </div>
    </div>
  );
}