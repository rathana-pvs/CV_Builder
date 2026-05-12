import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function guestResumeCookieName(id: string) {
  return `guest_resume_${id}`;
}

export async function getResumeWithAccess(id: string) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const resume = await prisma.resume.findUnique({ where: { id } });

  if (!resume) return null;

  if (resume.userId) {
    return currentUserId === resume.userId ? resume : null;
  }

  const guestToken = (await cookies()).get(guestResumeCookieName(id))?.value;
  if (!guestToken || !resume.guestToken || guestToken !== resume.guestToken) {
    return null;
  }

  return resume;
}
