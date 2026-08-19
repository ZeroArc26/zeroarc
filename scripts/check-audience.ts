import "dotenv/config";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function checkAudience() {
  await connectDB();

  const products = await Product.find(
    {},
    { "basicInfo.title": 1, "basicInfo.audience": 1, "publish.status": 1 }
  )
    .sort({ "basicInfo.audience": 1, "basicInfo.title": 1 })
    .lean();

  const groups: Record<string, any[]> = { men: [], women: [], unisex: [], missing: [] };

  for (const p of products) {
    const audience = (p as any).basicInfo?.audience;
    const key = audience && groups[audience] ? audience : "missing";
    groups[key].push(p);
  }

  console.log(`\nTotal products: ${products.length}\n`);

  for (const key of ["men", "women", "unisex", "missing"]) {
    const list = groups[key];
    console.log(`\n=== ${key.toUpperCase()} (${list.length}) ===`);
    list.forEach((p: any) => {
      console.log(
        `  - ${p.basicInfo?.title ?? "(no title)"}  [status: ${p.publish?.status ?? "?"}]  id: ${p._id}`
      );
    });
  }

  console.log(
    `\nTip: everything under UNISEX or MISSING that should actually be Men or Women needs to be re-tagged in admin (Product > Basic Info > Audience) and saved.\n`
  );

  process.exit(0);
}

checkAudience().catch((err) => {
  console.error(err);
  process.exit(1);
});
