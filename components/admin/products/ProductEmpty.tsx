import Link from "next/link";

export default function ProductEmpty() {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 py-24 text-center">

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-4xl">
        📦
      </div>

      <h2 className="text-2xl font-bold">
        No Products Found
      </h2>

      <p className="mt-3 text-zinc-400">
        Create your first product to start selling.
      </p>

      <Link
        href="/admin/products/new"
        className="mt-8 inline-flex rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
      >
        Create Product
      </Link>

    </div>
  );
}