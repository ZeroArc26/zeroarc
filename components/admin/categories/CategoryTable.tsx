"use client";

import {
  Badge
} from "@/components/ui/badge";

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
      category.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      category.slug
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (
    <div className="overflow-hidden rounded-2xl border bg-card">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b bg-muted/40">

            <tr className="text-left text-sm">

              <th className="px-6 py-4">
                Image
              </th>

              <th className="px-6 py-4">
                Name
              </th>

              <th className="px-6 py-4">
                Slug
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Featured
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredCategories.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No categories found.
                </td>
              </tr>

            ) : (

              filteredCategories.map((category) => (

                <tr
                  key={category._id}
                  className="border-b last:border-0"
                >


                  {/* Image */}

                  <td className="px-6 py-4">

                    {category.image?.url ? (

                      <img
                        src={category.image.url}
                        alt={
                          category.image.alt ||
                          category.name
                        }
                        className="h-14 w-14 rounded-xl object-cover"
                      />

                    ) : (

                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-xs">
                        N/A
                      </div>

                    )}

                  </td>



                  {/* Name */}

                  <td className="px-6 py-4">

                    <div className="font-medium">
                      {category.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>

                  </td>



                  {/* Slug */}

                  <td className="px-6 py-4">

                    <Badge variant="secondary">
                      {category.slug}
                    </Badge>

                  </td>



                  {/* Status */}

                  <td className="px-6 py-4">

                    <Badge
                      variant={
                        category.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {category.status}
                    </Badge>

                  </td>



                  {/* Featured */}

                  <td className="px-6 py-4">

                    <Badge
                      variant={
                        category.featured
                          ? "default"
                          : "outline"
                      }
                    >
                      {category.featured
                        ? "Yes"
                        : "No"}
                    </Badge>

                  </td>



                  {/* Actions */}

                  <td className="px-6 py-4 text-right">

                    <div className="flex justify-end">

                      <CategoryActions
                        id={category._id}
                      />

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