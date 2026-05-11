import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueResumeSlug, uniqueResumeTitle } from "@/lib/slug";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const source = await prisma.resume.findFirst({ where: { id, userId } });
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const title = await uniqueResumeTitle(userId, `${source.title} Copy`);
  const slug = await uniqueResumeSlug(title);
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      slug,
      template: source.template,
      dataJson: source.dataJson as Prisma.InputJsonValue,
      isPublic: false,
    },
  });

  return NextResponse.json(resume, { status: 201 });
}
