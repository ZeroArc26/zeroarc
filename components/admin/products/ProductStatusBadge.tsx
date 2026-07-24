type ProductStatusBadgeProps = {
  active: boolean;
};

export default function ProductStatusBadge({
  active,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
          : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          active
            ? "bg-emerald-400"
            : "bg-red-400"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}