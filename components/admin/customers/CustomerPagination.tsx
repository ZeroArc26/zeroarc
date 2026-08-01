"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CustomerPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function CustomerPagination({
  page,
  totalPages,
  total,
  limit,
}: CustomerPaginationProps) {

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  function changePage(newPage: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", newPage.toString());

    router.push(
      `${pathname}?${params.toString()}`
    );
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

const end = Math.min(page * limit, total);

  const pages = Array.from(
  { length: totalPages },
  (_, index) => index + 1
);


  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
  Showing{" "}
  <span className="font-medium text-foreground">
    {start}
  </span>
  {" - "}
  <span className="font-medium text-foreground">
    {end}
  </span>
  {" of "}
  <span className="font-medium text-foreground">
    {total}
  </span>{" "}
  customers
</p>
              <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {totalPages}
          </span>
        </span>

        <div className="flex items-center gap-1">
  {pages.map((pageNumber) => (
    <Button
      key={pageNumber}
      variant={
        page === pageNumber
          ? "default"
          : "outline"
      }
      size="icon"
      onClick={() => changePage(pageNumber)}
    >
      {pageNumber}
    </Button>
  ))}
</div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
          </div>
  );
}