import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ResumeRecord } from "@/lib/resume-types";
import { getResumeWithAccess } from "@/lib/resume-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume Editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResumeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const { id } = await params;

  const resume = await getResumeWithAccess(id);

  if (!resume) notFound();

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
