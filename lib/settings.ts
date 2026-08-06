import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function getStoreSettings() {
  await connectDB();

  let settings = await Settings.findOne({ singleton: "main" }).lean<any>();

  if (!settings) {
    const created = await Settings.create({ singleton: "main" });
    settings = created.toObject();
  }

  return settings;
}