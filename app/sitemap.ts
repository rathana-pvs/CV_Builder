import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  let publicResumes: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    publicResumes = await prisma.resume.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    publicResumes = [];
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...publicResumes.map((resume) => ({
      url: `${siteUrl}/cv/${resume.slug}`,
      lastModified: resume.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
