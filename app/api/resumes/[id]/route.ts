import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueResumeSlug } from "@/lib/slug";

async function getResumeWithAccess(id: string) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) return null;
  
  // If it has no owner, anyone with the ID can access it (guest flow).
  if (!resume.userId) return resume;
  
  // If it has an owner, check match
  if (currentUserId === resume.userId) return resume;

  return null;
}

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
  const slug = await uniqueResumeSlug(String(body.slug || body.title || resume.title), id);

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      title: String(body.title || resume.title),
      slug,
      template: String(body.template || resume.template),
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
