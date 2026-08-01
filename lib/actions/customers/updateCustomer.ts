"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/lib/validations/customer.schema";

export async function updateCustomer(
  id: string,
  data: CustomerFormValues
) {
  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid customer ID.",
      };
    }

    // Validate Data
    const validatedData = customerSchema.parse(data);

    // Find Customer
    const customer = await Customer.findById(id);

    if (!customer) {
      return {
        success: false,
        message: "Customer not found.",
      };
    }

    // Check Duplicate Phone
    const existingPhone = await Customer.findOne({
      phone: validatedData.phone,
      _id: { $ne: id },
    });

    if (existingPhone) {
      return {
        success: false,
        message: "Phone number already exists.",
      };
    }

    // Update Editable Fields Only
    customer.name = validatedData.name;
    customer.phone = validatedData.phone;
    customer.avatar = validatedData.avatar ?? "";

    customer.address = {
      address: validatedData.address.address,
      city: validatedData.address.city,
      state: validatedData.address.state,
      pincode: validatedData.address.pincode,
      country: validatedData.address.country,
    };

    customer.status = validatedData.status;

    // Email intentionally NOT updated
    // totalOrders NOT updated
    // totalSpent NOT updated
    // lastOrderAt NOT updated

    await customer.save();

    return {
      success: true,
      message: "Customer updated successfully.",
      data: JSON.parse(JSON.stringify(customer)),
    };
  } catch (error) {
    console.error("Update Customer Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update customer.",
    };
  }
}