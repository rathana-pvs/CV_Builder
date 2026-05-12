import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/cv/"],
      disallow: ["/api/", "/dashboard/", "/login", "/resumes/"],
    },
    host: getSiteUrl(),
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
