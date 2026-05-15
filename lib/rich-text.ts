const ALLOWED_TAGS = new Set(["a", "b", "br", "div", "em", "i", "li", "ol", "p", "strong", "u", "ul"]);
const EMPTY_HTML_RE = /^(?:\s|&nbsp;|<br\s*\/?>|<\/?(?:div|p|span)[^>]*>)*$/i;

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function hasRichTextMarkup(value?: string | null) {
  return !!value && /<\s*\/?\s*[a-z][^>]*>/i.test(value);
}

function isAllowedHref(value: string) {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(value.trim());
}

function sanitizeTag(tag: string) {
  const match = tag.match(/^<\s*(\/?)\s*([a-z0-9]+)([^>]*)>/i);
  if (!match) return "";

  const closing = match[1] === "/";
  const name = match[2].toLowerCase();
  const attrs = match[3] || "";

  if (!ALLOWED_TAGS.has(name)) return "";
  if (name === "br") return "<br>";
  if (closing) return `</${name}>`;
  if (name !== "a") return `<${name}>`;

  const hrefMatch = attrs.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const href = hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || "";

  if (!href || !isAllowedHref(href)) return "<a>";
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">`;
}

export function sanitizeRichTextHtml(value?: string | null) {
  if (!value) return "";

  let output = "";
  let cursor = 0;

  for (const match of String(value).matchAll(/<[^>]*>/g)) {
    output += escapeHtml(String(value).slice(cursor, match.index));
    output += sanitizeTag(match[0]);
    cursor = (match.index || 0) + match[0].length;
  }

  output += escapeHtml(String(value).slice(cursor));
  return output.replace(EMPTY_HTML_RE, "").trim();
}

export function renderPlainTextDescription(value?: string | null) {
  if (!value) return "";
  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function renderRichTextDescription(value?: string | null) {
  if (!value) return "";
  return hasRichTextMarkup(value) ? sanitizeRichTextHtml(value) : renderPlainTextDescription(value);
}

export function renderPlainTextBlock(value?: string | null) {
  if (!value) return "";
  const paragraphs = value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!paragraphs.length) return "";
  return paragraphs.map((item) => `<p>${escapeHtml(item).replace(/\n/g, "<br>")}</p>`).join("");
}

export function renderRichTextBlock(value?: string | null) {
  if (!value) return "";
  return hasRichTextMarkup(value) ? sanitizeRichTextHtml(value) : renderPlainTextBlock(value);
}

export function stripRichText(value?: string | null) {
  if (!value) return "";

  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
