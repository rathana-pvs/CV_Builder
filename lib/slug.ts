import { prisma } from "@/lib/prisma";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56);
}

export async function uniqueResumeSlug(base: string, ignoreId?: string) {
  const clean = slugify(base || "resume") || "resume";
  let slug = clean;
  let index = 2;

  while (true) {
    const existing = await prisma.resume.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${clean}-${index}`;
    index += 1;
  }
}

export async function uniqueResumeTitle(userId: string | null | undefined, baseTitle: string = "Untitled Resume") {
  let title = baseTitle;
  let index = 2;

  while (true) {
    // Check if this specific user already owns a resume with this name
    const existing = await prisma.resume.findFirst({
      where: {
        title,
        ...(userId ? { userId } : { userId: null }),
      },
    });

    if (!existing) return title;
    title = `${baseTitle} ${index}`;
    index += 1;
  }
}
