import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  orderSchema,
  type OrderFormValues,
} from "@/lib/validations/order.schema";


export async function createOrder(
  data: OrderFormValues
) {

  await connectDB();


  // Validate Data

  const validatedData =
    orderSchema.parse(data);



  // Create Initial Timeline

  const timeline = [
    {
      event: "Order Placed",
      date: new Date(),
    },
  ];



  const order = await Order.create({

    ...validatedData,

    timeline,

  });



  return {

    success: true,

    orderId: order._id.toString(),

    orderNumber:
      order.orderInfo.orderNumber,

  };

}