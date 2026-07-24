"use client";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-zinc-800 bg-[#09090B]/80 px-8 backdrop-blur-xl">

      <div>
        <h1 className="text-2xl font-black">
          Dashboard
        </h1>

        <p className="text-sm text-zinc-500">
          Welcome back, Admin 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          placeholder="Search..."
          className="w-80 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none transition focus:border-violet-500"
        />

        <button className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-violet-500">
          🔔
        </button>

        <button className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 transition hover:border-violet-500">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold">
            A
          </div>

          <div className="text-left">
            <p className="font-semibold">
              Admin
            </p>

            <p className="text-xs text-zinc-500">
              Super Admin
            </p>
          </div>

        </button>

      </div>

    </header>
  );
}