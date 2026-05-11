import { notFound } from "next/navigation";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { prisma } from "@/lib/prisma";
import type { ResumeData, TemplateId } from "@/lib/resume-types";

export default async function PublicCvPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resume = await prisma.resume.findFirst({
    where: { slug, isPublic: true },
  });

  if (!resume) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-slate-100 p-6">
      <ResumeTemplate data={resume.dataJson as ResumeData} template={resume.template as TemplateId} />
    </main>
  );
}
