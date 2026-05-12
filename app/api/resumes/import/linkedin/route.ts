import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { createRequire } from "module";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { guestResumeCookieName } from "@/lib/resume-access";
import { parseLinkedInProfileText } from "@/lib/linkedin-import";
import { uniqueResumeSlug, uniqueResumeTitle } from "@/lib/slug";

export const runtime = "nodejs";

const require = createRequire(import.meta.url);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let profileText = "";

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { PDFParse } = require("pdf-parse") as {
      PDFParse: {
        new (options: { data: Buffer }): {
          getText: () => Promise<{ text?: string }>;
          destroy: () => Promise<void>;
        };
        setWorker: (workerSrc?: string) => string;
      };
    };
    const { getData } = require("pdf-parse/worker") as {
      getData: () => string;
    };
    PDFParse.setWorker(getData());
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      profileText = String(result.text || "").trim();
    } finally {
      await parser.destroy();
    }
  } else {
    const body = await request.json();
    profileText = String(body.profileText || "").trim();
  }

  if (!profileText) {
    return NextResponse.json({ error: "Could not extract profile text." }, { status: 400 });
  }

  const importedData = parseLinkedInProfileText(profileText);
  const baseTitle = importedData.personal.name
    ? `${importedData.personal.name} Resume`
    : "Imported LinkedIn Resume";
  const title = await uniqueResumeTitle(userId, baseTitle);
  const slug = await uniqueResumeSlug(title);
  const guestToken = userId ? null : randomUUID();

  const resume = await prisma.resume.create({
    data: {
      ...(userId ? { userId } : {}),
      ...(guestToken ? { guestToken } : {}),
      title,
      slug,
      template: "modern",
      dataJson: importedData,
      isPublic: false,
    },
  });

  const response = NextResponse.json({ id: resume.id }, { status: 201 });
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
