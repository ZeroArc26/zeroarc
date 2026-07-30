import "dotenv/config";

import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";


async function createTestOrder() {

  await connectDB();


  const order = await Order.create({

    orderInfo: {

      orderNumber: "ZA-TEST-001",

      status: "processing",

      source: "admin",

      orderDate: new Date(),

    },


    customer: {

      name: "Rahul Sharma",

      email: "rahul@test.com",

      phone: "9876543210",


      billingAddress: {

        address: "MG Road",

        city: "Patna",

        state: "Bihar",

        pincode: "800001",

        country: "India",

      },

    },


    items: [

      {

        name: "ZeroArc Oversized Tee",

        image: "/products/test.png",

        sku: "ZA-TEE-001",

        hsnCode: "6109",

        quantity: 2,

        price: 999,

        gstRate: 18,

        gstAmount: 360,

        totalAmount: 2358,

      },

    ],


    pricing: {

      subtotal: 1998,

      discount: 0,

      taxableAmount: 1998,

      cgst: 179.82,

      sgst: 179.82,

      igst: 0,

      totalTax: 359.64,

      grandTotal: 2358,

    },


    payment: {

      method: "upi",

      status: "paid",

      transactionId: "TEST-UPI-12345",

    },


    customerInvoice: {

      invoiceNumber:
        "INV-ZA-TEST-001",

      sellerDetails: {

        brandName: "ZeroArc",

      },

    },


    shippingLabel: {

      shippingId:
        "SHIP-ZA-TEST-001",

      trackingId:
        "ZA-TRK-TEST-001",


      receiver: {

        name: "Rahul Sharma",

        phone: "9876543210",

        address: "MG Road",

        city: "Patna",

        state: "Bihar",

        pincode: "800001",

      },


      items: [

        {

          name: "ZeroArc Oversized Tee",

          quantity: 2,

        },

      ],


      warehouse: {

        name: "ZeroArc Warehouse",

        address: "Bihar",

        phone: "9999999999",

      },


      qrCodeUrl:
        "https://example.com/track/ZA-TRK-TEST-001",

    },


    timeline: [

      {

        event: "Order Placed",

        date: new Date(),

      },

      {

        event: "Processing",

        date: new Date(),

      },

    ],


    adminNotes: [],


  });


  console.log(
    "Order Created:",
    order._id.toString()
  );


  await mongoose.connection.close();

}


createTestOrder();