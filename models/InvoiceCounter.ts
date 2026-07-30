import mongoose, { Schema, models } from "mongoose";


const InvoiceCounterSchema = new Schema(

  {

    year: {

      type: Number,

      required: true,

      unique: true,

    },


    sequence: {

      type: Number,

      default: 0,

    },


  },

  {

    timestamps: true,

  }

);



const InvoiceCounter =
  models.InvoiceCounter ||
  mongoose.model(
    "InvoiceCounter",
    InvoiceCounterSchema
  );


export default InvoiceCounter;