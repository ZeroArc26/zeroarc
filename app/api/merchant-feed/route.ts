import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const SITE_URL = "https://zeroarc.in";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  await connectDB();

  const products = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
  }).lean<any[]>();

  const items = products
    .map((p) => {
      const totalStock = (p.variants || []).reduce(
        (sum: number, v: any) => sum + (v.stock || 0),
        0
      );

      const coverImage =
        p.images?.find((img: any) => img.isCover)?.url || p.images?.[0]?.url;

      // A product with no cover image can't be listed — Merchant
      // Center requires image_link on every item.
      if (!coverImage) return null;

      return `
    <item>
      <g:id>${escapeXml(p._id.toString())}</g:id>
      <g:title>${escapeXml(p.basicInfo.title)}</g:title>
      <g:description>${escapeXml(
        (p.basicInfo.description || p.basicInfo.title).slice(0, 5000)
      )}</g:description>
      <g:link>${SITE_URL}/products/${escapeXml(p.basicInfo.slug)}</g:link>
      <g:image_link>${escapeXml(coverImage)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${totalStock > 0 ? "in stock" : "out of stock"}</g:availability>
      <g:price>${p.pricing.sellingPrice} INR</g:price>
      <g:brand>ZeroArc</g:brand>
      <g:mpn>${escapeXml(p.inventory?.sku || p._id.toString())}</g:mpn>
      <g:product_type>${escapeXml(p.basicInfo.category || "Apparel")}</g:product_type>
    </item>`;
    })
    .filter(Boolean)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>ZeroArc</title>
  <link>${SITE_URL}</link>
  <description>Premium anime-inspired streetwear</description>${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
