import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function generateBarcode(): string {
  let barcode = "";
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  return barcode;
}

async function fixBarcodes() {
  const { default: connectDB } = await import("@/lib/mongodb");
  const { default: Product } = await import("@/models/Product");

  await connectDB();

  const products = await Product.find({});

  console.log(`\nChecking ${products.length} products...\n`);

  const seenBarcodes = new Map<string, string>(); // barcode -> product title
  let fixedMissing = 0;
  let fixedDuplicate = 0;

  for (const product of products) {
    const title = product.basicInfo?.title ?? "(no title)";
    let barcode = product.inventory?.barcode;

    // 1. Missing barcode -> generate a fresh one.
    if (!barcode || !barcode.trim()) {
      barcode = generateBarcode();
      product.inventory.barcode = barcode;
      await product.save();
      fixedMissing++;
      console.log(`  [FILLED]    ${title} -> ${barcode}`);
    }
    // 2. Duplicate barcode (already used by another product) -> regenerate.
    else if (seenBarcodes.has(barcode)) {
      const clashWith = seenBarcodes.get(barcode);
      const newBarcode = generateBarcode();
      product.inventory.barcode = newBarcode;
      await product.save();
      fixedDuplicate++;
      console.log(
        `  [DUPLICATE] ${title} had the same barcode as "${clashWith}" -> reassigned ${newBarcode}`
      );
      barcode = newBarcode;
    } else {
      console.log(`  [OK]        ${title} -> ${barcode}`);
    }

    seenBarcodes.set(barcode, title);
  }

  console.log(
    `\nDone. ${fixedMissing} missing barcode(s) filled, ${fixedDuplicate} duplicate(s) resolved, ${products.length} total products.\n`
  );

  process.exit(0);
}

fixBarcodes().catch((err) => {
  console.error(err);
  process.exit(1);
});
