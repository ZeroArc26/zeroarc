import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

async function seedCustomers() {
  try {
    await connectDB();

    await Customer.deleteMany({});

    const customers = [];

    for (let i = 1; i <= 20; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@zeroarc.com`,
        phone: `9876543${String(i).padStart(3, "0")}`,

        avatar: "",

        address: {
          address: `Street ${i}`,
          city: "Ranchi",
          state: "Jharkhand",
          pincode: "834001",
          country: "India",
        },

        status: i % 5 === 0 ? "blocked" : "active",

        totalOrders: Math.floor(Math.random() * 10),

        totalSpent: Math.floor(Math.random() * 15000),

        lastOrderAt: new Date(),
      });
    }
        await Customer.insertMany(customers);

    console.log("✅ 20 dummy customers created successfully!");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Customers Error:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
}

seedCustomers();