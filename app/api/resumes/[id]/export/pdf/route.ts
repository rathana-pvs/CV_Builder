import { NextResponse } from "next/server";
import { renderResumeHtml } from "@/lib/resume-html";
import { getResumeWithAccess } from "@/lib/resume-access";
import { isTemplateId, type ResumeData } from "@/lib/resume-types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const requestedTemplate = searchParams.get("template");
  const queryTemplate = isTemplateId(requestedTemplate) ? requestedTemplate : null;
  if (requestedTemplate && !queryTemplate) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }
  const queryAccent = searchParams.get("accent");
  const queryFilename = searchParams.get("filename");

  const storedTemplate = isTemplateId(resume.template) ? resume.template : "modern";
  const activeTemplate = queryTemplate || storedTemplate;
  const activeAccent = queryAccent || undefined;
  const finalFilenameBase = queryFilename?.trim() || resume.slug;
  const finalFilename = `${finalFilenameBase.replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;

  const isDev = process.env.NODE_ENV === "development";

  // Fallback for local development dynamically searching for default paths
  let browser;
  try {
    if (isDev) {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
      });
    } else {
      const puppeteer = await import("puppeteer-core");
      const chromium = (await import("@sparticuz/chromium")).default;
      browser = await puppeteer.launch({
        args: (chromium as any).args,
        defaultViewport: (chromium as any).defaultViewport,
        executablePath: await (chromium as any).executablePath(),
        headless: (chromium as any).headless,
      } as any);
    }
  } catch (error) {
    console.error("Failed to launch browser in PDF route:", error);
    return NextResponse.json(
      { error: "PDF export is not available because the browser runtime could not start." },
      { status: 500 }
    );
  }

  try {
    const page = await browser.newPage();
    await page.setContent(renderResumeHtml(resume.dataJson as ResumeData, activeTemplate, activeAccent), {
      waitUntil: "load",
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const body = Uint8Array.from(pdf).buffer;

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(finalFilename)}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
