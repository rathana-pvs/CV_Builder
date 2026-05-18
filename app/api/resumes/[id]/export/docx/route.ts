import { NextResponse } from "next/server";
import type { ResumeData } from "@/lib/resume-types";
import { getResumeWithAccess } from "@/lib/resume-access";
import { stripRichText } from "@/lib/rich-text";

function documentXml(data: ResumeData, templateId = "modern") {
  const escapeXml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const ACCENT_COLOR = (data.color || "#1e3a8a").replace("#", "").toUpperCase();

  const sectionHeading = (title: string) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="320" w:after="120"/>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ACCENT_COLOR}"/>
        </w:pBdr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="24"/>
          <w:szCs w:val="24"/>
          <w:b/>
          <w:color w:val="${ACCENT_COLOR}"/>
        </w:rPr>
        <w:t>${title.toUpperCase()}</w:t>
      </w:r>
    </w:p>
  `;

  const parseRichTextToParagraphs = (text: string, colorTheme: string, isLightBg = true) => {
    const textColor = isLightBg ? "334155" : "E2E8F0";
    const bulletColor = isLightBg ? colorTheme : "FFFFFF";
    const stripped = stripRichText(text);
    const lines = stripped.split("\n").map(l => l.trim()).filter(Boolean);
    
    return lines.map(line => {
      const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.startsWith("+");
      let content = line;
      if (isBullet) {
        content = line.replace(/^[•\-\*\+]\s*/, "");
      }
      
      const escaped = escapeXml(content);
      
      if (isBullet) {
        return `
    <w:p>
      <w:pPr>
        <w:ind w:left="360" w:hanging="180"/>
        <w:spacing w:before="60" w:after="60"/>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="${textColor}"/>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="${bulletColor}"/>
          <w:b/>
        </w:rPr>
        <w:t>•   </w:t>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="${textColor}"/>
        </w:rPr>
        <w:t>${escaped}</w:t>
      </w:r>
    </w:p>`;
      } else {
        return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="60" w:after="100"/>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="${textColor}"/>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="${textColor}"/>
        </w:rPr>
        <w:t>${escaped}</w:t>
      </w:r>
    </w:p>`;
      }
    }).join("");
  };

  const nameEscaped = escapeXml(data.personal.name || "Your Name");
  const headlineEscaped = escapeXml(data.personal.headline || "");
  const contactDetails = [
    data.personal.email ? `Email: ${data.personal.email}` : "",
    data.personal.phone ? `Phone: ${data.personal.phone}` : "",
    data.personal.location ? `Location: ${data.personal.location}` : "",
    data.personal.website ? `Website: ${data.personal.website}` : ""
  ].filter(Boolean).join("  |  ");

  // Sidebar Specific Helpers
  const sidebarSectionHeading = (title: string, isLightBg = false) => `
    <w:p>
      <w:pPr>
        <w:spacing w:before="240" w:after="80"/>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="6" w:space="4" w:color="${isLightBg ? ACCENT_COLOR : "FFFFFF"}"/>
        </w:pBdr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:b/>
          <w:color w:val="${isLightBg ? "1E293B" : "FFFFFF"}"/>
        </w:rPr>
        <w:t>${title.toUpperCase()}</w:t>
      </w:r>
    </w:p>
  `;

  // Render Left-Sidebar Modern layout
  if (templateId === "modern") {
    const sidebarContent = `
      <!-- Sidebar Name & Headline -->
      <w:p>
        <w:pPr>
          <w:jc w:val="left"/>
          <w:spacing w:before="300" w:after="60"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="40"/>
            <w:szCs w:val="40"/>
            <w:b/>
            <w:color w:val="FFFFFF"/>
          </w:rPr>
          <w:t>${nameEscaped}</w:t>
        </w:r>
      </w:p>

      ${headlineEscaped ? `
      <w:p>
        <w:pPr>
          <w:jc w:val="left"/>
          <w:spacing w:before="0" w:after="240"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:i/>
            <w:color w:val="E2E8F0"/>
          </w:rPr>
          <w:t>${headlineEscaped}</w:t>
        </w:r>
      </w:p>
      ` : ""}

      <!-- Contact details -->
      ${sidebarSectionHeading("Contact", false)}
      ${[
        data.personal.email ? `✉  ${data.personal.email}` : "",
        data.personal.phone ? `✆  ${data.personal.phone}` : "",
        data.personal.location ? `⌖  ${data.personal.location}` : "",
        data.personal.website ? `⊕  ${data.personal.website}` : ""
      ].filter(Boolean).map(c => `
        <w:p>
          <w:pPr><w:spacing w:before="60" w:after="60"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
              <w:color w:val="FFFFFF"/>
            </w:rPr>
            <w:t>${escapeXml(c)}</w:t>
          </w:r>
        </w:p>
      `).join("")}

      <!-- Skills -->
      ${data.skills && data.skills.length > 0 ? `
        ${sidebarSectionHeading("Skills", false)}
        <w:p>
          <w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
              <w:color w:val="FFFFFF"/>
            </w:rPr>
            <w:t>${escapeXml(data.skills.join(", "))}</w:t>
          </w:r>
        </w:p>
      ` : ""}

      <!-- Languages -->
      ${data.languages && data.languages.length > 0 ? `
        ${sidebarSectionHeading("Languages", false)}
        <w:p>
          <w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
              <w:color w:val="FFFFFF"/>
            </w:rPr>
            <w:t>${escapeXml(data.languages.join(", "))}</w:t>
          </w:r>
        </w:p>
      ` : ""}

      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
        ${sidebarSectionHeading("Certifications", false)}
        ${data.certifications.map(item => `
          <w:p>
            <w:pPr><w:spacing w:before="80" w:after="40"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="18"/>
                <w:szCs w:val="18"/>
                <w:b/>
                <w:color w:val="FFFFFF"/>
              </w:rPr>
              <w:t>${escapeXml(item.name || "")}</w:t>
            </w:r>
          </w:p>
          ${item.issuer || item.date ? `
          <w:p>
            <w:pPr><w:spacing w:before="0" w:after="80"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="16"/>
                <w:szCs w:val="16"/>
                <w:color w:val="E2E8F0"/>
              </w:rPr>
              <w:t>${escapeXml([item.issuer, item.date].filter(Boolean).join(" · "))}</w:t>
            </w:r>
          </w:p>
          ` : ""}
        `).join("")}
      ` : ""}
    `;

    const mainContent = `
      <!-- Profile -->
      ${data.summary ? `
        ${sectionHeading("Profile")}
        ${parseRichTextToParagraphs(data.summary, ACCENT_COLOR, true)}
      ` : ""}

      <!-- Experience -->
      ${data.experience && data.experience.length > 0 ? `
        ${sectionHeading("Experience")}
        ${data.experience.map(item => {
          const role = escapeXml(item.role || "Position");
          const company = escapeXml(item.company || "");
          const dates = escapeXml([item.startDate, item.endDate].filter(Boolean).join(" – "));
          
          return `
            <w:p>
              <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="22"/>
                  <w:b/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>${role}</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr><w:spacing w:before="0" w:after="60"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:b/>
                  <w:color w:val="${ACCENT_COLOR}"/>
                </w:rPr>
                <w:t>${company}</w:t>
              </w:r>
              ${dates ? `
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="64748B"/>
                </w:rPr>
                <w:t>  |  ${dates}</w:t>
              </w:r>
              ` : ""}
            </w:p>
            ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
          `;
        }).join("")}
      ` : ""}

      <!-- Education -->
      ${data.education && data.education.length > 0 ? `
        ${sectionHeading("Education")}
        ${data.education.map(item => {
          const degree = escapeXml(item.degree || "Degree");
          const school = escapeXml(item.school || "");
          const dates = escapeXml([item.startDate, item.endDate].filter(Boolean).join(" – "));
          
          return `
            <w:p>
              <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="22"/>
                  <w:b/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>${degree}</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr><w:spacing w:before="0" w:after="60"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:b/>
                  <w:color w:val="475569"/>
                </w:rPr>
                <w:t>${school}</w:t>
              </w:r>
              ${dates ? `
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="64748B"/>
                </w:rPr>
                <w:t>  |  ${dates}</w:t>
              </w:r>
              ` : ""}
            </w:p>
            ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
          `;
        }).join("")}
      ` : ""}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        ${sectionHeading("Projects")}
        ${data.projects.map(item => {
          const name = escapeXml(item.name || "Project");
          const link = escapeXml(item.link || "");
          
          return `
            <w:p>
              <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="22"/>
                  <w:b/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>${name}</w:t>
              </w:r>
              ${link ? `
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="${ACCENT_COLOR}"/>
                </w:rPr>
                <w:t>  (${link})</w:t>
              </w:r>
              ` : ""}
            </w:p>
            ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
          `;
        }).join("")}
      ` : ""}
    `;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
          <w:insideH w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/>
          <w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="180" w:type="dxa"/>
          <w:right w:w="180" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="2800"/>
        <w:gridCol w:w="6000"/>
      </w:tblGrid>
      <w:tr>
        <!-- Sidebar Cell -->
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="2800" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="${ACCENT_COLOR}"/>
          </w:tcPr>
          ${sidebarContent}
        </w:tc>
        <!-- Main Content Cell -->
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="6000" w:type="dxa"/>
          </w:tcPr>
          ${mainContent}
        </w:tc>
      </w:tr>
    </w:tbl>

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  }

  // Render Left-Main, Right-Sidebar Corporate layout
  if (templateId === "corporate") {
    const horizontalContacts = [
      data.personal.email ? `✉  ${data.personal.email}` : "",
      data.personal.phone ? `✆  ${data.personal.phone}` : "",
      data.personal.location ? `⌖  ${data.personal.location}` : "",
      data.personal.website ? `⊕  ${data.personal.website}` : ""
    ].filter(Boolean).join("    |    ");

    const headerContent = `
      <!-- Corporate Colored Top Accent Rule -->
      <w:p>
        <w:pPr>
          <w:pBdr>
            <w:top w:val="single" w:sz="36" w:space="8" w:color="${ACCENT_COLOR}"/>
          </w:pBdr>
          <w:spacing w:before="120" w:after="120"/>
        </w:pPr>
      </w:p>

      <!-- Candidate Name -->
      <w:p>
        <w:pPr>
          <w:jc w:val="left"/>
          <w:spacing w:before="120" w:after="40"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="52"/>
            <w:szCs w:val="52"/>
            <w:b/>
            <w:color w:val="0F172A"/>
          </w:rPr>
          <w:t>${nameEscaped.toUpperCase()}</w:t>
        </w:r>
      </w:p>

      <!-- Headline -->
      ${headlineEscaped ? `
      <w:p>
        <w:pPr>
          <w:jc w:val="left"/>
          <w:spacing w:before="0" w:after="120"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:b/>
            <w:color w:val="${ACCENT_COLOR}"/>
          </w:rPr>
          <w:t>${headlineEscaped.toUpperCase()}</w:t>
        </w:r>
      </w:p>
      ` : ""}

      <!-- Contact details -->
      ${horizontalContacts ? `
      <w:p>
        <w:pPr>
          <w:jc w:val="left"/>
          <w:spacing w:before="0" w:after="240"/>
          <w:pBdr>
            <w:bottom w:val="single" w:sz="6" w:space="6" w:color="E2E8F0"/>
          </w:pBdr>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
            <w:color w:val="475569"/>
          </w:rPr>
          <w:t>${escapeXml(horizontalContacts)}</w:t>
        </w:r>
      </w:p>
      ` : ""}
    `;

    const leftMainContent = `
      <!-- Profile -->
      ${data.summary ? `
        ${sectionHeading("Profile")}
        ${parseRichTextToParagraphs(data.summary, ACCENT_COLOR, true)}
      ` : ""}

      <!-- Experience -->
      ${data.experience && data.experience.length > 0 ? `
        ${sectionHeading("Employment History")}
        ${data.experience.map(item => {
          const role = escapeXml(item.role || "Position");
          const company = escapeXml(item.company || "");
          const dates = escapeXml([item.startDate, item.endDate].filter(Boolean).join(" – "));
          
          return `
            <w:p>
              <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="22"/>
                  <w:b/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>${role}</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr><w:spacing w:before="0" w:after="60"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:b/>
                  <w:color w:val="${ACCENT_COLOR}"/>
                </w:rPr>
                <w:t>${company}</w:t>
              </w:r>
              ${dates ? `
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="64748B"/>
                </w:rPr>
                <w:t>  |  ${dates}</w:t>
              </w:r>
              ` : ""}
            </w:p>
            ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
          `;
        }).join("")}
      ` : ""}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        ${sectionHeading("Projects")}
        ${data.projects.map(item => {
          const name = escapeXml(item.name || "Project");
          const link = escapeXml(item.link || "");
          
          return `
            <w:p>
              <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="22"/>
                  <w:b/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>${name}</w:t>
              </w:r>
              ${link ? `
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="${ACCENT_COLOR}"/>
                </w:rPr>
                <w:t>  (${link})</w:t>
              </w:r>
              ` : ""}
            </w:p>
            ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
          `;
        }).join("")}
      ` : ""}
    `;

    const rightSidebarContent = `
      <!-- Skills -->
      ${data.skills && data.skills.length > 0 ? `
        ${sidebarSectionHeading("Skills", true)}
        <w:p>
          <w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:cs="Arial"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
              <w:color w:val="334155"/>
            </w:rPr>
            <w:t>${escapeXml(data.skills.join(", "))}</w:t>
          </w:r>
        </w:p>
      ` : ""}

      <!-- Languages -->
      ${data.languages && data.languages.length > 0 ? `
        ${sidebarSectionHeading("Languages", true)}
        <w:p>
          <w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:cs="Arial"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
              <w:color w:val="334155"/>
            </w:rPr>
            <w:t>${escapeXml(data.languages.join(", "))}</w:t>
          </w:r>
        </w:p>
      ` : ""}

      <!-- Education -->
      ${data.education && data.education.length > 0 ? `
        ${sidebarSectionHeading("Education", true)}
        ${data.education.map(item => `
          <w:p>
            <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                <w:sz w:val="18"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${escapeXml(item.degree || "")}</w:t>
            </w:r>
          </w:p>
          <w:p>
            <w:pPr><w:spacing w:before="0" w:after="40"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                <w:sz w:val="16"/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t>${escapeXml(item.school || "")}</w:t>
            </w:r>
          </w:p>
          ${item.startDate || item.endDate ? `
          <w:p>
            <w:pPr><w:spacing w:before="0" w:after="80"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                <w:sz w:val="16"/>
                <w:color w:val="64748B"/>
                <w:i/>
              </w:rPr>
              <w:t>${escapeXml([item.startDate, item.endDate].filter(Boolean).join(" – "))}</w:t>
            </w:r>
          </w:p>
          ` : ""}
        `).join("")}
      ` : ""}

      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
        ${sidebarSectionHeading("Certifications", true)}
        ${data.certifications.map(item => `
          <w:p>
            <w:pPr><w:spacing w:before="80" w:after="40"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                <w:sz w:val="18"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${escapeXml(item.name || "")}</w:t>
            </w:r>
          </w:p>
          ${item.issuer || item.date ? `
          <w:p>
            <w:pPr><w:spacing w:before="0" w:after="80"/></w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial"/>
                <w:sz w:val="16"/>
                <w:color w:val="64748B"/>
              </w:rPr>
              <w:t>${escapeXml([item.issuer, item.date].filter(Boolean).join(" · "))}</w:t>
            </w:r>
          </w:p>
          ` : ""}
        `).join("")}
      ` : ""}
    `;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${headerContent}

    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
          <w:insideH w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/>
          <w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="180" w:type="dxa"/>
          <w:right w:w="180" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="5800"/>
        <w:gridCol w:w="3000"/>
      </w:tblGrid>
      <w:tr>
        <!-- Main Column Cell -->
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="5800" w:type="dxa"/>
          </w:tcPr>
          ${leftMainContent}
        </w:tc>
        <!-- Sidebar Cell (F1F5F9 shaded background) -->
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="3000" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
          </w:tcPr>
          ${rightSidebarContent}
        </w:tc>
      </w:tr>
    </w:tbl>

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  }

  // Render Default High-fidelity single-column layouts (Classic, Sea Focus, Minimal, Executive, etc.)
  const centeredHeader = `
    <!-- Candidate Name -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="200" w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="56"/>
          <w:szCs w:val="56"/>
          <w:b/>
          <w:color w:val="${ACCENT_COLOR}"/>
        </w:rPr>
        <w:t>${nameEscaped}</w:t>
      </w:r>
    </w:p>

    <!-- Headline -->
    ${headlineEscaped ? `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="0" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="26"/>
          <w:szCs w:val="26"/>
          <w:i/>
          <w:color w:val="475569"/>
        </w:rPr>
        <w:t>${headlineEscaped}</w:t>
      </w:r>
    </w:p>
    ` : ""}

    <!-- Contact Info -->
    ${contactDetails ? `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="0" w:after="240"/>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="12" w:space="8" w:color="${ACCENT_COLOR}"/>
        </w:pBdr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
          <w:sz w:val="19"/>
          <w:szCs w:val="19"/>
          <w:color w:val="64748B"/>
        </w:rPr>
        <w:t>${escapeXml(contactDetails)}</w:t>
      </w:r>
    </w:p>
    ` : ""}
  `;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${centeredHeader}

    <!-- Summary -->
    ${data.summary ? `
      ${sectionHeading("Professional Summary")}
      ${parseRichTextToParagraphs(data.summary, ACCENT_COLOR, true)}
    ` : ""}

    <!-- Experience Section -->
    ${data.experience && data.experience.length > 0 ? `
      ${sectionHeading("Professional Experience")}
      ${data.experience.map(item => {
        const role = escapeXml(item.role || "Position");
        const company = escapeXml(item.company || "");
        const dates = escapeXml([item.startDate, item.endDate].filter(Boolean).join(" - "));
        
        return `
          <!-- Position Line -->
          <w:p>
            <w:pPr>
              <w:spacing w:before="120" w:after="40"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${role}</w:t>
            </w:r>
            ${company ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t>  at  </w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:b/>
                <w:color w:val="${ACCENT_COLOR}"/>
              </w:rPr>
              <w:t>${company}</w:t>
            </w:r>
            ` : ""}
            ${dates ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="19"/>
                <w:szCs w:val="19"/>
                <w:color w:val="64748B"/>
              </w:rPr>
              <w:t>  |  ${dates}</w:t>
            </w:r>
            ` : ""}
          </w:p>
          
          <!-- Job Description -->
          ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
        `;
      }).join("")}
    ` : ""}

    <!-- Education Section -->
    ${data.education && data.education.length > 0 ? `
      ${sectionHeading("Education")}
      ${data.education.map(item => {
        const degree = escapeXml(item.degree || "Degree");
        const school = escapeXml(item.school || "");
        const dates = escapeXml([item.startDate, item.endDate].filter(Boolean).join(" - "));
        
        return `
          <!-- Degree Line -->
          <w:p>
            <w:pPr>
              <w:spacing w:before="120" w:after="40"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${degree}</w:t>
            </w:r>
            ${school ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t>  —  </w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:b/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t>${school}</w:t>
            </w:r>
            ` : ""}
            ${dates ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="19"/>
                <w:szCs w:val="19"/>
                <w:color w:val="64748B"/>
              </w:rPr>
              <w:t>  |  ${dates}</w:t>
            </w:r>
            ` : ""}
          </w:p>
          
          <!-- Education Details -->
          ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
        `;
      }).join("")}
    ` : ""}

    <!-- Projects Section -->
    ${data.projects && data.projects.length > 0 ? `
      ${sectionHeading("Projects")}
      ${data.projects.map(item => {
        const name = escapeXml(item.name || "Project");
        const link = escapeXml(item.link || "");
        
        return `
          <!-- Project Line -->
          <w:p>
            <w:pPr>
              <w:spacing w:before="120" w:after="40"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${name}</w:t>
            </w:r>
            ${link ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="18"/>
                <w:szCs w:val="18"/>
                <w:color w:val="${ACCENT_COLOR}"/>
              </w:rPr>
              <w:t>  (${link})</w:t>
            </w:r>
            ` : ""}
          </w:p>
          
          <!-- Project Description -->
          ${parseRichTextToParagraphs(item.description, ACCENT_COLOR, true)}
        `;
      }).join("")}
    ` : ""}

    <!-- Skills Section -->
    ${data.skills && data.skills.length > 0 ? `
      ${sectionHeading("Skills")}
      <w:p>
        <w:pPr>
          <w:spacing w:before="80" w:after="160"/>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:color w:val="334155"/>
          </w:rPr>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:color w:val="334155"/>
          </w:rPr>
          <w:t>${escapeXml(data.skills.join(", "))}</w:t>
        </w:r>
      </w:p>
    ` : ""}

    <!-- Languages Section -->
    ${data.languages && data.languages.length > 0 ? `
      ${sectionHeading("Languages")}
      <w:p>
        <w:pPr>
          <w:spacing w:before="80" w:after="160"/>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:color w:val="334155"/>
          </w:rPr>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
            <w:sz w:val="20"/>
            <w:szCs w:val="20"/>
            <w:color w:val="334155"/>
          </w:rPr>
          <w:t>${escapeXml(data.languages.join(", "))}</w:t>
        </w:r>
      </w:p>
    ` : ""}

    <!-- Certifications Section -->
    ${data.certifications && data.certifications.length > 0 ? `
      ${sectionHeading("Certifications")}
      ${data.certifications.map(item => {
        const certName = escapeXml(item.name || "Certification");
        const issuer = escapeXml(item.issuer || "");
        const date = escapeXml(item.date || "");
        
        return `
          <w:p>
            <w:pPr>
              <w:spacing w:before="80" w:after="80"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="20"/>
                <w:szCs w:val="20"/>
                <w:b/>
                <w:color w:val="1E293B"/>
              </w:rPr>
              <w:t>${certName}</w:t>
            </w:r>
            ${issuer ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="20"/>
                <w:szCs w:val="20"/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t>  —  ${issuer}</w:t>
            </w:r>
            ` : ""}
            ${date ? `
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                <w:sz w:val="19"/>
                <w:szCs w:val="19"/>
                <w:color w:val="64748B"/>
                <w:i/>
              </w:rPr>
              <w:t>  (${date})</w:t>
            </w:r>
            ` : ""}
          </w:p>
        `;
      }).join("")}
    ` : ""}

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await getResumeWithAccess(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (true) {
    return NextResponse.json(
      { error: "DOCX export is temporarily disabled. Please use PDF export." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryFilename = searchParams.get("filename");
  const finalFilenameBase = queryFilename?.trim() || resume!.slug;
  const finalFilename = `${finalFilenameBase.replace(/[^a-zA-Z0-9._-]/g, "_")}.docx`;

  const PizZip = (await import("pizzip")).default;
  const Docxtemplater = (await import("docxtemplater")).default;
  const zip = new PizZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  
  const storedTemplate = resume!.template || "modern";
  zip.folder("word")?.file("document.xml", documentXml(resume!.dataJson as ResumeData, storedTemplate));

  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render({});
  const buffer = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });
  const body = Uint8Array.from(buffer).buffer;

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(finalFilename)}"`,
    },
  });
}
