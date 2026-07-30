import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";


export async function getOrders() {

  await connectDB();


  const orders = await Order.find()
    .sort({
      createdAt: -1,
    })
    .lean();


  return orders.map((order: any) => ({
    id: String(order._id),

    orderNumber:
      order.orderInfo.orderNumber,

    customer:
      order.customer.name,

    email:
      order.customer.email,

    total:
      order.pricing.grandTotal,

    status:
      order.orderInfo.status,

    payment:
      order.payment.status,

    date:
      order.orderInfo.orderDate,

  }));

}