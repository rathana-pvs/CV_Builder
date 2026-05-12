import type { MetadataRoute } from "next";
import { defaultSeoDescription, getSiteUrl, siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: defaultSeoDescription,
    start_url: getSiteUrl(),
    scope: getSiteUrl(),
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#0f172a",
    categories: ["business", "productivity"],
    lang: "en-US",
  };
}
