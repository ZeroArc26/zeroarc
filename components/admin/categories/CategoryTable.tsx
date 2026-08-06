"use client";

import Image from "next/image";

import CategoryActions from "./CategoryActions";

interface CategoryTableProps {
  categories: any[];
  search: string;
}

export default function CategoryTable({
  categories,
  search,
}: CategoryTableProps) {
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-zinc-800 transition hover:bg-zinc-900"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
                        {category.image?.url ? (
                          <Image
                            src={category.image.url}
                            alt={category.image.alt || category.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                            N/A
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                      {category.slug}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        category.status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        category.featured
                          ? "bg-violet-500/15 text-violet-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {category.featured ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <CategoryActions id={category._id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}