import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>


      {/* Search */}
      <Skeleton className="h-16 w-full rounded-2xl" />


      {/* Table */}
      <div className="space-y-4 rounded-2xl border p-6">

        {[1,2,3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-5"
          >

            <Skeleton className="h-14 w-14 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-4 w-72" />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}