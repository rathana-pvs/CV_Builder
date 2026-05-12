import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueResumeSlug } from "@/lib/slug";
import { getResumeWithAccess } from "@/lib/resume-access";
import { isTemplateId } from "@/lib/resume-types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(resume);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const nextTemplate = body.template;
  if (nextTemplate !== undefined && !isTemplateId(nextTemplate)) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }
  const slug = await uniqueResumeSlug(String(body.slug || body.title || resume.title), id);

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      title: String(body.title || resume.title),
      slug,
      template: nextTemplate || resume.template,
      dataJson: body.dataJson || resume.dataJson,
      isPublic: Boolean(body.isPublic),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
