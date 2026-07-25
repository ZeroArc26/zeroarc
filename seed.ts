import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Product from "./models/Product";
import connectDB from "./lib/mongodb";

async function seed() {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany([
      {
        title: "Arc Beginning Tee",
        slug: "arc-beginning-tee",
        description:
          "Premium oversized anime streetwear t-shirt.",
        price: 1499,
        comparePrice: 1999,
        category: "T-Shirts",
        collectionName: "Summer 2026",
        images: [
          "/products/arc-beginning/front.webp",
          "/products/arc-beginning/back.webp",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        stock: 35,
        featured: true,
        bestseller: true,
        newArrival: true,
        active: true,
      },
    ]);

    console.log("✅ Products Seeded Successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

seed();