import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import type { ResumeRecord } from "@/lib/resume-types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardClient
      resumes={
        resumes.map((resume) => ({
          id: resume.id,
          title: resume.title,
          slug: resume.slug,
          template: resume.template,
          dataJson: resume.dataJson,
          isPublic: resume.isPublic,
          updatedAt: resume.updatedAt.toISOString(),
        })) as ResumeRecord[]
      }
    />
  );
}
