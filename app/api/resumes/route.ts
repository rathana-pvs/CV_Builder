import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emptyResumeData, sampleResumeData } from "@/lib/sample-resume";
import { uniqueResumeSlug, uniqueResumeTitle } from "@/lib/slug";
import { guestResumeCookieName } from "@/lib/resume-access";
import { isTemplateId } from "@/lib/resume-types";

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
  let dataMode: "empty" | "sample" = "sample";
  try {
    const body = await req.json();
    if (isTemplateId(body.template)) chosenTemplate = body.template;
    if (body.dataMode === "empty") dataMode = "empty";
  } catch {
    // ignore body parsing errors
  }

  const title = await uniqueResumeTitle(userId);
  const slug = await uniqueResumeSlug(title);
  const guestToken = userId ? null : randomUUID();
  const resume = await prisma.resume.create({
    data: {
      ...(userId ? { userId } : {}),
      ...(guestToken ? { guestToken } : {}),
      title,
      slug,
      template: chosenTemplate,
      dataJson: dataMode === "empty" ? emptyResumeData : sampleResumeData,
      isPublic: false,
    },
  });

  const response = NextResponse.json(resume, { status: 201 });
  if (guestToken) {
    response.cookies.set(guestResumeCookieName(resume.id), guestToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
