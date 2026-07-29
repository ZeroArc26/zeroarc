"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center">

      <h2 className="text-2xl font-bold">
        Something went wrong
      </h2>

      <p className="mt-2 text-muted-foreground">
        Failed to load categories.
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
      >
        Try Again
      </button>

    </div>
  );
}