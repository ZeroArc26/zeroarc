interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  description,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      {badge && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
          {badge}
        </p>
      )}

      <h2 className="text-4xl font-black text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}