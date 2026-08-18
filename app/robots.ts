import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/merchant-feed"],
      disallow: ["/admin", "/account", "/checkout", "/api"],
    },
    sitemap: "https://zeroarc.in/sitemap.xml",
  };
}
