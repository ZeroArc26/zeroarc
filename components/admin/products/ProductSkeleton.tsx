export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <div className="animate-pulse">

        {[1,2,3,4,5].map((item)=>(
          <div
            key={item}
            className="flex items-center gap-6 border-b border-zinc-800 p-6"
          >
            <div className="h-16 w-16 rounded-xl bg-zinc-800"/>

            <div className="flex-1">

              <div className="mb-3 h-4 w-48 rounded bg-zinc-800"/>

              <div className="h-3 w-32 rounded bg-zinc-800"/>

            </div>

            <div className="h-10 w-24 rounded bg-zinc-800"/>

          </div>
        ))}

      </div>
    </div>
  );
}