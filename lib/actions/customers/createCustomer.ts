"use server";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/lib/validations/customer.schema";

export async function createCustomer(
  data: CustomerFormValues
) {
  try {
    await connectDB();

    // Validate Input
    const validatedData = customerSchema.parse(data);

    // Check Duplicate Email
    const existingEmail = await Customer.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingEmail) {
      return {
        success: false,
        message: "Customer with this email already exists.",
      };
    }

    // Check Duplicate Phone
    const existingPhone = await Customer.findOne({
      phone: validatedData.phone,
    });

    if (existingPhone) {
      return {
        success: false,
        message: "Customer with this phone number already exists.",
      };
    }

    // Create Customer
    const customer = await Customer.create({
      ...validatedData,
      email: validatedData.email.toLowerCase(),

      status: validatedData.status ?? "active",

      totalOrders: 0,
      totalSpent: 0,
      lastOrderAt: undefined,
    });

    return {
      success: true,
      message: "Customer created successfully.",
      customer,
    };
  } catch (error) {
    console.error("Create Customer Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create customer.",
    };
  }
}