import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";


export async function getOrderById(
  id: string
) {

  await connectDB();


  const order = await Order.findById(id)
    .lean<any>();


  if (!order) {
    return null;
  }


  return {
    id: String(order._id),

    orderInfo: order.orderInfo,

    customer: order.customer,

    items: order.items,

    pricing: order.pricing,

    payment: order.payment,

    customerInvoice:
      order.customerInvoice,

    shippingLabel:
      order.shippingLabel,

    timeline:
      order.timeline || [],

    adminNotes:
      order.adminNotes || [],

    createdAt:
      order.createdAt,

    updatedAt:
      order.updatedAt,
  };

}