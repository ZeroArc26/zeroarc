"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function deleteCustomer(id: string) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid customer ID.",
      };
    }

    // Find Customer
    const customer = await Customer.findById(id);

    if (!customer) {
      return {
        success: false,
        message: "Customer not found.",
      };
    }

    // Prevent deleting customers who have placed orders
    if (customer.totalOrders > 0) {
      return {
        success: false,
        message:
          "This customer has existing orders and cannot be deleted.",
      };
    }

    // Delete Customer
    await Customer.findByIdAndDelete(id);

    return {
      success: true,
      message: "Customer deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Customer Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete customer.",
    };
  }
}