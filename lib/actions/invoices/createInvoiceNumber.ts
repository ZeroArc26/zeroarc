"use server";

import connectDB from "@/lib/mongodb";
import InvoiceCounter from "@/models/InvoiceCounter";


export async function createInvoiceNumber() {

  await connectDB();


  const year = new Date()
    .getFullYear();



  const counter =
    await InvoiceCounter.findOneAndUpdate(

      {
        year,
      },


      {
        $inc: {
          sequence: 1,
        },
      },


      {
        new: true,

        upsert: true,

      }

    );



  const sequence =
    String(counter.sequence)
      .padStart(6, "0");



  return (
    `INV-ZA-${year}-${sequence}`
  );

}