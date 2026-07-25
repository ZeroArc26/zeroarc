"use client";

type DeleteProductDialogProps = {
  open: boolean;
  productTitle: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteProductDialog({
  open,
  productTitle,
  loading = false,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white">
          Delete Product
        </h2>

        <p className="mt-4 text-zinc-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            "{productTitle}"
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-400">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-zinc-700 px-5 py-2 transition hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}