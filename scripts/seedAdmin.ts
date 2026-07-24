import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  const { default: connectDB } = await import("@/lib/mongodb");
  const { default: Admin } = await import("@/models/Admin");

  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      "Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD in .env.local"
    );
  }

  await connectDB();

  const existingAdmin = await Admin.findOne({
    email: adminEmail,
  });

  if (existingAdmin) {
    console.log("✅ Super Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await Admin.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: "SUPER_ADMIN",
    isActive: true,
  });

  console.log("🎉 Super Admin created successfully!");
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });