import Order from "@/models/Order";
import { trackDelhiveryShipment } from "@/lib/delhivery";

type OrderDoc = InstanceType<typeof Order>;

interface TrackingStatus {
  Status?: string;
  StatusType?: string;
  StatusDateTime?: string;
}

interface TrackingPayload {
  ShipmentData?: { Shipment?: { Status?: TrackingStatus } }[];
}

function hasEvent(order: OrderDoc, event: string) {
  return (order.timeline || []).some(
    (t: { event?: string }) => t.event === event
  );
}

/**
 * Pulls the latest Delhivery status for an order and moves the order
 * forward (processing -> shipped -> delivered). Never moves it
 * backwards and never touches cancelled/delivered orders.
 * Returns true if the order was changed.
 */
export async function syncOrderWithDelhivery(
  order: OrderDoc,
  prefetched?: unknown
): Promise<boolean> {
  const label = order.shippingLabel;
  const current = order.orderInfo?.status as string | undefined;

  if (
    !label?.awbNumber ||
    label.courierPartner !== "Delhivery" ||
    label.isProvisionalAwb ||
    !current ||
    !["confirmed", "processing", "shipped"].includes(current)
  ) {
    return false;
  }

  let raw = prefetched as TrackingPayload | undefined;
  if (!raw) {
    const result = await trackDelhiveryShipment(label.awbNumber);
    if (!result.success) return false;
    raw = result.raw as TrackingPayload;
  }

  const status = raw?.ShipmentData?.[0]?.Shipment?.Status;
  if (!status) return false;

  const text = (status.Status || "").toLowerCase();
  const type = status.StatusType || "";

  const isDelivered = type === "DL" || text === "delivered";
  const isMoving =
    type === "UD" && !/manifest|not picked|pickup/.test(text);

  let changed = false;

  if (isDelivered) {
    order.orderInfo.status = "delivered";
    if (!hasEvent(order, "Order Delivered")) {
      order.timeline.push({
        event: "Order Delivered",
        date: status.StatusDateTime ? new Date(status.StatusDateTime) : new Date(),
      });
    }
    changed = true;
  } else if (isMoving && current !== "shipped") {
    order.orderInfo.status = "shipped";
    if (!hasEvent(order, "Order Shipped")) {
      order.timeline.push({ event: "Order Shipped", date: new Date() });
    }
    changed = true;
  } else if (type === "RT" && !hasEvent(order, "Return To Origin Initiated")) {
    order.timeline.push({
      event: "Return To Origin Initiated",
      date: new Date(),
    });
    changed = true;
  }

  if (changed) await order.save();
  return changed;
}
