export default function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Top Left Glow */}
      <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[180px]" />

      {/* Top Right Glow */}
      <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[200px]" />

      {/* Bottom Center Glow */}
      <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[170px]" />

      {/* Small Accent Glow */}
      <div className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-violet-400/10 blur-[120px]" />

    </div>
  );
}