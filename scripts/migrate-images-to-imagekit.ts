/**
 * One-time migration: copies every Product/Category image currently
 * hosted on BunnyCDN over to ImageKit, then updates the corresponding
 * MongoDB document to point at the new ImageKit URL.
 *
 * Run with:  npm run migrate:images
 *
 * Safe to re-run — it only touches images whose URL still starts with
 * BUNNY_CDN_URL, so anything already migrated (or already on ImageKit)
 * is skipped automatically.
 *
 * This does NOT delete anything from BunnyCDN. Once you've confirmed
 * every image loads correctly from ImageKit, you can cancel/let the
 * Bunny subscription lapse and remove the BUNNY_CDN_URL entry from
 * next.config.ts's remotePatterns yourself.
 */

import type ImageKitClient from "imagekit";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Everything below is imported dynamically, AFTER dotenv.config() has
// run — static `import` statements are hoisted above any other
// top-level code (including dotenv.config()), so lib/mongodb.ts's
// top-level `if (!MONGODB_URI) throw ...` check would otherwise run
// before the .env.local file was ever loaded.

const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL || "";

if (!BUNNY_CDN_URL) {
  console.error(
    "BUNNY_CDN_URL is not set — needed to identify which images still need migrating. Add it to .env.local (even though Bunny uploads are no longer active, this script needs it to recognize old URLs)."
  );
  process.exit(1);
}

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || "";
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY || "";

if (!BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_API_KEY) {
  console.error(
    "BUNNY_STORAGE_ZONE / BUNNY_STORAGE_API_KEY not set — needed to pull images directly from Bunny's Storage API (bypassing the suspended CDN/pull-zone domain)."
  );
  process.exit(1);
}

/**
 * Downloads straight from Bunny's Storage API rather than the public
 * `zeroarc.b-cdn.net` CDN URL — the CDN/pull-zone can be suspended
 * (unpaid bandwidth bill) while the underlying Storage Zone still has
 * every file intact, since they're billed/managed separately.
 */
async function downloadFromBunnyStorage(
  publicUrl: string
): Promise<Buffer | null> {
  const path = publicUrl.slice(BUNNY_CDN_URL.length).replace(/^\/+/, "");

  const res = await fetch(
    `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${path}`,
    {
      headers: { AccessKey: BUNNY_STORAGE_API_KEY },
    }
  );

  if (!res.ok) {
    console.error(`  ✗ Storage API download failed for ${path} (${res.status})`);
    return null;
  }

  return Buffer.from(await res.arrayBuffer());
}

async function migrateOneImage(
  imagekit: ImageKitClient,
  url: string,
  folder: string
): Promise<string | null> {
  if (!url || !url.startsWith(BUNNY_CDN_URL)) {
    // Already migrated, or not a Bunny URL at all — leave it alone.
    return null;
  }

  try {
    const buffer = await downloadFromBunnyStorage(url);
    if (!buffer) return null;

    const filename = url.split("/").pop() || `${Date.now()}.jpg`;

    const result = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: `/${folder}`,
      useUniqueFileName: false,
    });

    return result.url;
  } catch (error) {
    console.error(`  ✗ Failed to migrate ${url}:`, error);
    return null;
  }
}

async function main() {
  const { default: connectDB } = await import("../lib/mongodb");
  const { default: Product } = await import("../models/Product");
  const { default: Category } = await import("../models/Category");
  const { imagekit } = await import("../lib/imagekit");

  await connectDB();

  console.log("Starting BunnyCDN -> ImageKit migration...");

  // Products
  const products = await Product.find({
    "images.url": { $regex: `^${BUNNY_CDN_URL}` },
  });

  console.log(`\nProducts with Bunny images: ${products.length}`);

  let productsMigrated = 0;

  for (const product of products) {
    let changed = false;

    for (const image of product.images) {
      const newUrl = await migrateOneImage(imagekit, image.url, "products");
      if (newUrl) {
        console.log(`  ✓ ${product.basicInfo?.title}: ${image.url} -> ${newUrl}`);
        image.url = newUrl;
        changed = true;
      }
    }

    if (changed) {
      await product.save();
      productsMigrated++;
    }
  }

  console.log(`Products updated: ${productsMigrated}`);

  // Categories
  const categories = await Category.find({
    "image.url": { $regex: `^${BUNNY_CDN_URL}` },
  });

  console.log(`\nCategories with Bunny images: ${categories.length}`);

  let categoriesMigrated = 0;

  for (const category of categories) {
    const newUrl = await migrateOneImage(imagekit, category.image.url, "categories");
    if (newUrl) {
      console.log(`  ✓ ${category.name}: ${category.image.url} -> ${newUrl}`);
      category.image.url = newUrl;
      await category.save();
      categoriesMigrated++;
    }
  }

  console.log(`Categories updated: ${categoriesMigrated}`);

  console.log("\nMigration complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
