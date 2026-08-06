import mongoose, { Schema, models } from "mongoose";


const OrderSchema = new Schema(

  {

    // =========================
    // ORDER INFORMATION
    // =========================

    orderInfo: {

      orderNumber: {
        type: String,
        required: true,
        unique: true,
      },


      status: {

        type: String,

        enum: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],

        default: "pending",

      },


      source: {

        type: String,

        enum: [
          "website",
          "admin",
        ],

        default: "website",

      },


      orderDate: {

        type: Date,

        default: Date.now,

      },

    },



    // =========================
    // CUSTOMER DETAILS
    // =========================

    customer: {

      name: {
        type: String,
        required: true,
      },


      email: {
        type: String,
      },


      phone: {
        type: String,
      },


      billingAddress: {

        address: String,

        city: String,

        state: String,

        pincode: String,

        country: {
          type: String,
          default: "India",
        },

      },


      shippingAddress: {

        address: String,

        city: String,

        state: String,

        pincode: String,

        country: {
          type: String,
          default: "India",
        },

      },


    },



    // =========================
    // ORDER ITEMS
    // =========================

    items: [

      {

        productId: {

          type: Schema.Types.ObjectId,

          ref: "Product",

        },


        name: {

          type: String,

          required: true,

        },


        image: String,


        sku: String,

        size: String,

        color: String,


        hsnCode: {

          type: String,

          default: "6109",

        },


        quantity: {

          type: Number,

          default: 1,

        },


        price: Number,


        gstRate: {

          type: Number,

          default: 18,

        },


        gstAmount: Number,


        totalAmount: Number,


      }

    ],




    // =========================
    // PRICE DETAILS
    // =========================

    pricing: {


      subtotal: Number,


      discount: {

        type: Number,

        default: 0,

      },


      taxableAmount: Number,


      cgst: Number,


      sgst: Number,


      igst: Number,


      totalTax: Number,


      grandTotal: Number,


    },




    // =========================
    // PAYMENT DETAILS
    // =========================

    payment: {


      method: {

        type: String,

        enum: [
          "upi",
          "card",
          "cod",
          "netbanking",
        ],

      },


      status: {

        type: String,

        enum: [
          "pending",
          "paid",
          "failed",
        ],

        default: "pending",

      },


      transactionId: String,


    },




    // =========================
    // CUSTOMER TAX INVOICE
    // =========================

    invoiceInfo: {


      invoiceNumber: {

        type: String,

        unique: true,

      },


      invoiceDate: {

        type: Date,

        default: Date.now,

      },



      sellerDetails: {


        companyName: String,


        address: String,


        gstin: String,


        pan: String,


        email: String,


        phone: String,


      },



      billingDetails: {


        name: String,


        email: String,


        phone: String,


        address: String,


      },



      taxDetails: {


        subtotal: Number,


        discount: Number,


        taxableAmount: Number,


        cgst: Number,


        sgst: Number,


        igst: Number,


        totalTax: Number,


        grandTotal: Number,


      },



      tracking: {


        trackingId: String,


        qrCode: String,


      },


    },




    // =========================
    // SHIPPING LABEL
    // =========================

    shippingLabel: {


      shippingId: String,


      trackingId: String,

      courierPartner: String,

        awbNumber: String,

        weight: Number, // in KG

        dimensions: {
          length: Number, // cm
          width: Number,
          height: Number,
        },

        packageType: String,



      receiver: {


        name: String,


        phone: String,


        address: String,


        city: String,


        state: String,


        pincode: String,


      },



      warehouse: {


        name: String,


        address: String,


        phone: String,


      },



      qrCode: String,


    },




    // =========================
    // ORDER TIMELINE
    // =========================

    timeline: [


      {

        event: String,


        date: {

          type: Date,

          default: Date.now,

        },


      }


    ],





    // =========================
    // ADMIN NOTES
    // =========================

    adminNotes: [

      {

        note: String,


        createdAt: {

          type: Date,

          default: Date.now,

        },


      }

    ],


  },


  {

    timestamps: true,

  }


);



const Order =
  models.Order ||
  mongoose.model(
    "Order",
    OrderSchema
  );


export default Order;