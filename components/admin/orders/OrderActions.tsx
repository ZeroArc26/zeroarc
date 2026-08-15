"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateOrderStatus } from "@/lib/actions/orders/updateOrderStatus";
import { cancelOrder } from "@/lib/actions/orders/cancelOrder";
import { deleteOrder } from "@/lib/actions/orders/deleteOrder";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function OrderActions({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [loading, setLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  async function handleUpdate() {
    try {
      setLoading(true);

      await updateOrderStatus(
        orderId,
        status
      );

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await cancelOrder(orderId);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel order."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOrder() {
    const confirmed = window.confirm(
      "This will PERMANENTLY delete this order and cannot be undone. The customer's order count and total spent will be adjusted accordingly. Are you sure?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteOrder(orderId);

      toast.success("Order deleted.");
      router.push("/admin/dashboard/orders");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete order."
      );
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="text-xl font-bold text-white">
        Order Actions
      </h2>

      {/* Status */}

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Order Status
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as OrderStatus
              )
            }
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
          >
            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <button
            onClick={handleUpdate}
            disabled={
              loading ||
              status === currentStatus
            }
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Update Status"}
          </button>

        </div>

      </div>

      {/* Danger Zone */}

      <div className="mt-10 border-t border-zinc-800 pt-8">

        <h3 className="text-lg font-semibold text-red-500">
          Danger Zone
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          Cancelling an order cannot be undone.
        </p>

        <button
          onClick={handleCancelOrder}
          disabled={
            loading ||
            currentStatus === "cancelled" ||
            currentStatus === "delivered"
          }
          className="mt-5 rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : "Cancel Order"}
        </button>

        <div className="mt-6 border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-400">
            Permanently deleting an order removes it from the database
            entirely and adjusts the customer&apos;s order count/total
            spent. This cannot be undone.
          </p>

          <button
            onClick={handleDeleteOrder}
            disabled={deleting}
            className="mt-5 rounded-xl border border-red-600 px-6 py-3 text-sm font-medium text-red-500 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Order Permanently"}
          </button>
        </div>

      </div>

    </div>
  );
}