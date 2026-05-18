import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { prisma } from "@/lib/prisma";
import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { getSiteUrl, siteName } from "@/lib/seo";

type PublicCvPageProps = { params: Promise<{ slug: string }> };

function getCvTitle(data: ResumeData) {
  return data.personal.name || "Professional CV";
}

function getCvDescription(data: ResumeData) {
  const headline = data.personal.headline;
  const location = data.personal.location;

  if (headline && location) return `${headline} based in ${location}. View the public CV.`;
  if (headline) return `${headline}. View the public CV.`;
  if (data.summary) return data.summary.slice(0, 155);

  return "View this professional CV built with ResumeDot.";
}

export async function generateMetadata({ params }: PublicCvPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resume = await prisma.resume.findFirst({
    where: { slug, isPublic: true },
    select: { dataJson: true, updatedAt: true },
  });

  if (!resume) {
    return {
      title: "CV Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const data = resume.dataJson as ResumeData;
  const title = `${getCvTitle(data)} CV`;
  const description = getCvDescription(data);

  return {
    title,
    description,
    alternates: {
      canonical: `/cv/${slug}`,
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/cv/${slug}`,
      siteName,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicCvPage({ params }: PublicCvPageProps) {
  const { slug } = await params;
  const resume = await prisma.resume.findFirst({
    where: { slug, isPublic: true },
  });

  if (!resume) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${getSiteUrl()}/cv/${slug}`,
            dateModified: resume.updatedAt.toISOString(),
            mainEntity: {
              "@type": "Person",
              name: (resume.dataJson as ResumeData).personal.name || undefined,
              jobTitle: (resume.dataJson as ResumeData).personal.headline || undefined,
              address: (resume.dataJson as ResumeData).personal.location || undefined,
              description: getCvDescription(resume.dataJson as ResumeData),
              url: `${getSiteUrl()}/cv/${slug}`,
            },
          }),
        }}
      />
      <main className="mx-auto min-h-screen max-w-5xl bg-slate-100 p-6 public-cv">
        <ResumeTemplate data={resume.dataJson as ResumeData} template={resume.template as TemplateId} />
      </main>
    </>
  );
}
