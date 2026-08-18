import { MetadataRoute } from "next";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { COLLECTIONS } from "@/constants/collections";

const SITE_URL = "https://zeroarc.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const products = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
  })
    .select("basicInfo.slug updatedAt")
    .lean();

  const productEntries: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${SITE_URL}/products/${p.basicInfo.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/men`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/women`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/unisex`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/collections`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/size-guide`, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
