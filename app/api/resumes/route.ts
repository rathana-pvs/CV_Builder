import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sampleResumeData } from "@/lib/sample-resume";
import { uniqueResumeSlug, uniqueResumeTitle } from "@/lib/slug";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resumes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  let chosenTemplate = "modern";
  try {
    const body = await req.json();
    if (body.template) chosenTemplate = body.template;
  } catch (e) {
    // ignore body parsing errors
  }

  const title = await uniqueResumeTitle(userId);
  const slug = await uniqueResumeSlug(title);
  const resume = await prisma.resume.create({
    data: {
      ...(userId ? { userId } : {}),
      title,
      slug,
      template: chosenTemplate,
      dataJson: sampleResumeData,
      isPublic: false,
    },
  });

  return NextResponse.json(resume, { status: 201 });
}
