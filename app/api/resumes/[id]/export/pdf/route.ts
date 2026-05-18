import React from "react";
import { NextResponse } from "next/server";
import { buildResumeHtmlDocument, resolveAccent } from "@/lib/resume-react-html";
import { getResumeWithAccess } from "@/lib/resume-access";
import { isTemplateId, type ResumeData } from "@/lib/resume-types";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { renderToStaticMarkup } = await import("react-dom/server");
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
  const data = resume.dataJson as ResumeData;
  const activeAccent = resolveAccent(activeTemplate, queryAccent ?? undefined, data.color);

  const finalFilenameBase = queryFilename?.trim() || resume.slug;
  const finalFilename = `${finalFilenameBase.replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;

  // Sanitize data — same logic as ResumeTemplate.tsx
  const sanitizedData: ResumeData = {
    ...data,
    color: activeAccent,
    experience: (data.experience || []).filter(Boolean),
    education: (data.education || []).filter(Boolean),
    skills: (data.skills || []).filter(Boolean),
    languages: (data.languages || []).filter(Boolean),
    projects: (data.projects || []).filter(Boolean),
    certifications: (data.certifications || []).filter(Boolean),
  };

  // Render the same React component used in the browser preview to a static HTML string.
  // renderToStaticMarkup is called here (in route.ts) so it never leaks into client bundles.
  const activeTemplateEntry = TEMPLATES[activeTemplate] || TEMPLATES.modern;
  const SelectedTemplate = activeTemplateEntry.component;
  const bodyHtml = renderToStaticMarkup(
    React.createElement(
      "article",
      {
        className: `resume-page template-${activeTemplate} bg-white text-slate-800`,
        style: { "--resume-accent": activeAccent } as React.CSSProperties,
      },
      React.createElement(SelectedTemplate, { data: sanitizedData })
    )
  );

  const html = buildResumeHtmlDocument(bodyHtml, activeAccent);

  const isDev = process.env.NODE_ENV === "development";
  let browser;
  try {
    if (isDev) {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      const puppeteer = await import("puppeteer-core");
      const chromium = (await import("@sparticuz/chromium")).default;
      browser = await puppeteer.launch({
        args: [...(chromium as any).args, "--no-sandbox", "--disable-setuid-sandbox"],
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
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ["load", "networkidle0"] as any });
    await page.evaluateHandle(() => document.fonts.ready);

    // Insert page-break spacers — same logic as PreviewPanel adjustPageBreaks
    await page.evaluate(() => {
      const container = document.body;
      const pageHeight = 1123;

      let pageMarginTop = 40;
      const referenceEl =
        container.querySelector("main") ||
        container.querySelector("header") ||
        container.querySelector("aside") ||
        container.querySelector(".px-16") ||
        container.firstElementChild;
      if (referenceEl) {
        const computed = window.getComputedStyle(referenceEl);
        pageMarginTop = parseFloat(computed.paddingTop) || 40;
      }

      const elements: HTMLElement[] = [];
      container.querySelectorAll("section > :first-child").forEach((el) => elements.push(el as HTMLElement));
      container.querySelectorAll("section > :nth-child(2)").forEach((cnt) => {
        let target = cnt as HTMLElement;
        if (
          cnt.children.length === 1 &&
          (cnt.firstElementChild?.classList.contains("grid") ||
            cnt.firstElementChild?.classList.contains("flex") ||
            cnt.firstElementChild?.tagName === "UL" ||
            cnt.firstElementChild?.tagName === "OL")
        ) {
          target = cnt.firstElementChild as HTMLElement;
        }
        const isList =
          target.classList.contains("grid") ||
          target.classList.contains("flex") ||
          target.tagName === "UL" ||
          target.tagName === "OL" ||
          target.children.length > 1;
        if (isList) {
          Array.from(target.children).forEach((child) => elements.push(child as HTMLElement));
        } else {
          elements.push(target);
        }
      });

      if (elements.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const itemData = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return { el, originalTop: rect.top - containerRect.top, originalHeight: rect.height };
      });
      itemData.sort((a, b) => a.originalTop - b.originalTop);

      let cumulativeShift = 0;
      itemData.forEach((item) => {
        if (item.originalHeight > 1043) return;
        const shiftedTop = item.originalTop + cumulativeShift;
        const shiftedBottom = shiftedTop + item.originalHeight;
        const startPage = Math.floor(shiftedTop / pageHeight);
        const endPage = Math.floor(shiftedBottom / pageHeight);
        const relativeTop = shiftedTop - startPage * pageHeight;

        let neededSpacer = 0;
        if (startPage !== endPage) {
          neededSpacer = (startPage + 1) * pageHeight + pageMarginTop - shiftedTop;
        } else if (startPage > 0 && relativeTop < pageMarginTop) {
          neededSpacer = startPage * pageHeight + pageMarginTop - shiftedTop;
        }

        if (neededSpacer > 0) {
          let insertBefore = item.el;
          const section = item.el.closest("section");
          if (section && item.el !== section.firstElementChild) {
            const sectionEntries = elements.filter(
              (el) => section.contains(el) && el !== section.firstElementChild
            );
            if (sectionEntries.length > 0 && item.el === sectionEntries[0]) {
              insertBefore = (section.firstElementChild as HTMLElement) || section;

              // Recalculate neededSpacer based on the heading's actual visual position!
              const headingData = itemData.find((d) => d.el === insertBefore);
              if (headingData) {
                const headingShiftedTop = headingData.originalTop + cumulativeShift;
                const headingStartPage = Math.floor(headingShiftedTop / pageHeight);
                
                // Push heading to start exactly at the top margin of the next page
                const nextPageStart = (headingStartPage + 1) * pageHeight;
                neededSpacer = nextPageStart + pageMarginTop - headingShiftedTop;
              }
            }
          }

          // Calculate and collapse the margin-top of the element to prevent double margin at the top of subsequent pages
          let elementMarginTop = 0;
          let parentGap = 0;
          let isGrid = false;

          if (insertBefore) {
            const computedStyle = window.getComputedStyle(insertBefore);
            elementMarginTop = parseFloat(computedStyle.marginTop) || 0;

            if (insertBefore.parentNode) {
              const parentEl = insertBefore.parentNode as HTMLElement;
              const parentStyle = window.getComputedStyle(parentEl);
              parentGap = parseFloat(parentStyle.rowGap) || 0;
              isGrid = parentStyle.display === "grid" || parentStyle.display === "inline-grid";
            }
          }

          const finalSpacerHeight = Math.max(0, neededSpacer - elementMarginTop - parentGap);

          if (finalSpacerHeight > 0) {
            const spacer = document.createElement("div");
            spacer.style.height = `${finalSpacerHeight}px`;
            spacer.style.width = "100%";
            spacer.style.pointerEvents = "none";
            if (isGrid) {
              spacer.style.gridColumn = "1 / -1";
            }
            insertBefore.parentNode?.insertBefore(spacer, insertBefore);
          }

          cumulativeShift += neededSpacer;
        }
      });

      // Force the .resume-page wrapper to stretch to the exact bottom of the multi-page document
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      const totalPages = Math.max(1, Math.ceil(height / 1123));
      const targetHeight = totalPages * 1123;
      const resumePage = document.querySelector(".resume-page") as HTMLElement;
      if (resumePage) {
        resumePage.style.height = `${targetHeight}px`;
      }
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return new Response(Uint8Array.from(pdf).buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(finalFilename)}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
