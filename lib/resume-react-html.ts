/**
 * Returns the full self-contained HTML document shell for a PDF-ready resume page.
 * The `bodyHtml` argument should be the output of renderToStaticMarkup() called
 * from the API route (which is unambiguously server-side).
 */
export function buildResumeHtmlDocument(bodyHtml: string, activeAccent: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
    :root { --resume-accent: ${activeAccent}; }
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 794px;
      margin: 0 auto;
      box-sizing: border-box;
      background-color: white;
    }
    @media print {
      @page { margin: 0; }
      .page-container { width: 100%; margin: 0; }
    }
    .rich-text-input p, .rich-text-input ul, .rich-text-input ol,
    .rich-text-content p, .rich-text-content ul, .rich-text-content ol {
      margin-bottom: 0; margin-top: 0.35rem;
    }
    .rich-text-input ul, .rich-text-content ul { list-style: disc; padding-left: 1.25rem; }
    .rich-text-input ol, .rich-text-content ol { list-style: decimal; padding-left: 1.25rem; }
    .rich-text-input li, .rich-text-content li { margin-top: 0.15rem; }
    .rich-text-input a, .rich-text-content a {
      color: var(--resume-accent, #2563eb);
      overflow-wrap: anywhere;
      text-decoration: underline;
    }
    h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
    section, .section-container { break-inside: auto; page-break-inside: auto; }
    li, .skill-tag, .experience-entry, .education-entry, .project-entry, .certification-entry {
      break-inside: avoid; page-break-inside: avoid;
    }
    .grid, .flex { break-inside: auto; }
  </style>
</head>
<body class="bg-white">
  <div class="page-container">
    ${bodyHtml}
  </div>
</body>
</html>`;
}

/**
 * Resolves the active accent color for a given template + optional override.
 */
export function resolveAccent(template: string, accent?: string, dataColor?: string): string {
  if (accent) return accent;
  if (dataColor) return dataColor;
  if (template === "sea") return "#0f766e";
  if (template === "classic") return "#17201f";
  return "#2563eb";
}
