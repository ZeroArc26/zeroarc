"use client";

import { useEffect, useState } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Search,
  RotateCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerToolbar() {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const [status, setStatus] = useState(
    searchParams.get("status") ?? "all"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (search.trim()) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (status !== "all") {
        params.set("status", status);
      } else {
        params.delete("status");
      }

      params.delete("page");

      router.replace(
        `${pathname}?${params.toString()}`
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [
    search,
    status,
    pathname,
    router,
    searchParams,
  ]);

  function handleReset() {
    setSearch("");
    setStatus("all");

    router.replace(pathname);
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Customers
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="blocked">
              Blocked
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
          </div>
  );
}