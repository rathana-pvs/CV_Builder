import { NextResponse } from "next/server";
import type { ResumeData } from "@/lib/resume-types";
import { getResumeWithAccess } from "@/lib/resume-access";
import { stripRichText } from "@/lib/rich-text";

function documentXml(data: ResumeData) {
  const escapeXml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const paragraph = (value = "") => `<w:p><w:r><w:t>${escapeXml(value)}</w:t></w:r></w:p>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraph(data.personal.name)}
    ${paragraph(data.personal.headline)}
    ${paragraph([data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join(" | "))}
    ${paragraph("Summary")}
    ${paragraph(stripRichText(data.summary))}
    ${paragraph("Experience")}
    ${data.experience.map((item) => paragraph(`${item.role} - ${item.company} (${item.startDate} - ${item.endDate})\n${stripRichText(item.description)}`)).join("")}
    ${paragraph("Education")}
    ${data.education.map((item) => paragraph(`${item.degree} - ${item.school} (${item.startDate} - ${item.endDate})\n${stripRichText(item.description)}`)).join("")}
    ${paragraph("Projects")}
    ${data.projects.map((item) => paragraph(`${item.name} ${item.link}\n${stripRichText(item.description)}`)).join("")}
    ${paragraph(`Skills: ${data.skills.join(", ")}`)}
    ${paragraph(`Languages: ${data.languages.join(", ")}`)}
    ${paragraph(`Certifications: ${data.certifications.map((item) => `${item.name} - ${item.issuer} ${item.date}`).join(", ")}`)}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>`;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const PizZip = (await import("pizzip")).default;
  const Docxtemplater = (await import("docxtemplater")).default;
  const zip = new PizZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.folder("word")?.file("document.xml", documentXml(resume.dataJson as ResumeData));

  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render({});
  const buffer = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });
  const body = Uint8Array.from(buffer).buffer;

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${resume.slug}.docx"`,
    },
  });
}
