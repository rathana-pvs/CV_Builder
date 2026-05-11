import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderResumeHtml } from "@/lib/resume-html";
import type { ResumeData, TemplateId } from "@/lib/resume-types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Find the resume first
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If it belongs to someone, you must be them to export it.
  if (resume.userId && resume.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryTemplate = searchParams.get("template") as TemplateId | null;
  const queryAccent = searchParams.get("accent") as string | null;
  const queryFilename = searchParams.get("filename");

  const activeTemplate = queryTemplate || (resume.template as TemplateId);
  const activeAccent = queryAccent || undefined;
  const finalFilename = queryFilename ? `${queryFilename}.pdf` : `${resume.slug}.pdf`;

  const isDev = process.env.NODE_ENV === "development";

  // Dynamic loading to keep serverless initialization light
  const puppeteer = await import("puppeteer-core");
  const chromium = (await import("@sparticuz/chromium")).default;

  // Setup launch options based on environment
  const options = isDev
    ? {
        args: [],
        executablePath: "/usr/bin/google-chrome", // Or leave undefined if local dev has it globally
        headless: true,
      }
    : {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };

  // Fallback for local development dynamically searching for default paths
  if (isDev) {
     // In dev, simply use regular 'puppeteer' if installed or search local paths
     const localPuppeteer = await import("puppeteer").catch(() => null);
     if (localPuppeteer) {
        const browser = await localPuppeteer.default.launch({
           headless: true,
           args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        return await generatePdf(browser);
     }
  }

  const browser = await puppeteer.launch(options as any);
  return await generatePdf(browser);

  async function generatePdf(browser: any) {
    const page = await browser.newPage();
    await page.setContent(renderResumeHtml(resume!.dataJson as ResumeData, activeTemplate, activeAccent), {
      waitUntil: "networkidle0",
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();
    const body = Uint8Array.from(pdf).buffer;

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(finalFilename)}"`,
      },
    });
  }
}
