import { notFound } from "next/navigation";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ResumeRecord } from "@/lib/resume-types";

export const dynamic = "force-dynamic";

export default async function ResumeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const { id } = await params;
  
  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume) notFound();
  
  // Securely restrict access IF the resume is claimed by a user
  if (resume.userId && resume.userId !== currentUserId) {
    notFound();
  }

  return (
    <ResumeEditor
      resume={
        {
          id: resume.id,
          title: resume.title,
          slug: resume.slug,
          template: resume.template,
          dataJson: resume.dataJson,
          isPublic: resume.isPublic,
          updatedAt: resume.updatedAt.toISOString(),
        } as ResumeRecord
      }
      isLoggedIn={Boolean(currentUserId)}
    />
  );
}
