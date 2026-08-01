"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function getCustomerById(id: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid customer ID.",
      };
    }

    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return {
        success: false,
        message: "Customer not found.",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(customer)),
    };
  } catch (error) {
    console.error("Get Customer By ID Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch customer.",
    };
  }
}