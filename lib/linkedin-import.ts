import type { ResumeData } from "@/lib/resume-types";

const SECTION_ALIASES: Record<string, string> = {
  about: "summary",
  summary: "summary",
  experience: "experience",
  employment: "experience",
  education: "education",
  skills: "skills",
  certifications: "certifications",
  licenses: "certifications",
  languages: "languages",
  projects: "projects",
  contact: "contact",
  info: "contact",
};

function normalizeLine(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function isSectionHeader(line: string) {
  const normalized = normalizeLine(line).toLowerCase().replace(/:$/, "");
  return SECTION_ALIASES[normalized] || null;
}

function looksLikeDateRange(line: string) {
  return /\b(19|20)\d{2}\b/.test(line) || /\bpresent\b/i.test(line);
}

function splitDateRange(line: string) {
  const match = line.match(/(.+?)(?:\s*[–—-]\s*|\s+to\s+)(.+)/i);
  if (!match) return { startDate: line.trim(), endDate: "" };
  return {
    startDate: match[1].trim(),
    endDate: match[2].trim(),
  };
}

function dedupe(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseList(lines: string[]) {
  return dedupe(
    lines
      .flatMap((line) => line.split(/[,\u2022]/))
      .map((item) => normalizeLine(item))
      .filter(Boolean)
  );
}

function splitBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }

  if (current.length) blocks.push(current);
  return blocks;
}

function parseExperience(lines: string[]): ResumeData["experience"] {
  return splitBlocks(lines).map((block) => {
    const cleaned = block.map(normalizeLine).filter(Boolean);
    const role = cleaned[0] || "";
    let company = "";
    let startDate = "";
    let endDate = "";
    const descriptionLines: string[] = [];

    for (let index = 1; index < cleaned.length; index += 1) {
      const line = cleaned[index];
      if (!company && !looksLikeDateRange(line)) {
        company = line;
        continue;
      }
      if (!startDate && looksLikeDateRange(line)) {
        const parsed = splitDateRange(line);
        startDate = parsed.startDate;
        endDate = parsed.endDate;
        continue;
      }
      descriptionLines.push(line);
    }

    return {
      role,
      company,
      startDate,
      endDate,
      description: descriptionLines.join("\n"),
    };
  }).filter((item) => item.role || item.company);
}

function parseEducation(lines: string[]): ResumeData["education"] {
  return splitBlocks(lines).map((block) => {
    const cleaned = block.map(normalizeLine).filter(Boolean);
    const degree = cleaned[0] || "";
    let school = "";
    let startDate = "";
    let endDate = "";
    const descriptionLines: string[] = [];

    for (let index = 1; index < cleaned.length; index += 1) {
      const line = cleaned[index];
      if (!school && !looksLikeDateRange(line)) {
        school = line;
        continue;
      }
      if (!startDate && looksLikeDateRange(line)) {
        const parsed = splitDateRange(line);
        startDate = parsed.startDate;
        endDate = parsed.endDate;
        continue;
      }
      descriptionLines.push(line);
    }

    return {
      degree,
      school,
      startDate,
      endDate,
      description: descriptionLines.join("\n"),
    };
  }).filter((item) => item.degree || item.school);
}

function parseCertifications(lines: string[]): ResumeData["certifications"] {
  return splitBlocks(lines).map((block) => {
    const cleaned = block.map(normalizeLine).filter(Boolean);
    return {
      name: cleaned[0] || "",
      issuer: cleaned[1] || "",
      date: cleaned.find((line, index) => index > 0 && looksLikeDateRange(line)) || "",
    };
  }).filter((item) => item.name);
}

function parseProjects(lines: string[]): ResumeData["projects"] {
  return splitBlocks(lines).map((block) => {
    const cleaned = block.map(normalizeLine).filter(Boolean);
    return {
      name: cleaned[0] || "",
      link: cleaned.find((line) => /^https?:\/\//i.test(line) || /github\.com|gitlab\.com|linkedin\.com/i.test(line)) || "",
      description: cleaned.slice(1).join("\n"),
    };
  }).filter((item) => item.name);
}

function findEmail(lines: string[]) {
  const joined = lines.join(" ");
  return joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function findPhone(lines: string[]) {
  const joined = lines.join(" ");
  return joined.match(/(?:\+\d{1,3}\s*)?(?:\(?\d{2,4}\)?[\s.-]*){2,}\d{2,4}/)?.[0] || "";
}

function findWebsite(lines: string[]) {
  for (const line of lines) {
    const match = line.match(/(?:https?:\/\/)?(?:www\.)?(linkedin\.com\/in\/[^\s]+|[a-z0-9.-]+\.[a-z]{2,}[^\s]*)/i);
    if (match) return match[0].replace(/^https?:\/\//i, "");
  }
  return "";
}

function findLocation(lines: string[]) {
  return (
    lines.find((line) => !/@/.test(line) && !/^https?:\/\//i.test(line) && /,/.test(line) && !/\b(19|20)\d{2}\b/.test(line)) ||
    ""
  );
}

export function parseLinkedInProfileText(rawText: string): ResumeData {
  const lines = rawText.split(/\r?\n/);
  const sections: Record<string, string[]> = {
    intro: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    contact: [],
  };

  let currentSection = "intro";
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const header = isSectionHeader(line);
    if (header) {
      currentSection = header;
      continue;
    }
    sections[currentSection] ??= [];
    sections[currentSection].push(line);
  }

  const intro = sections.intro.map(normalizeLine).filter(Boolean);
  const allLines = Object.values(sections).flat().map(normalizeLine).filter(Boolean);
  const name = intro[0] || "Imported Candidate";
  const headline = intro.find((line, index) => index > 0 && !/@/.test(line) && !/^https?:\/\//i.test(line) && !/^\d+\s+(followers|connections)/i.test(line)) || "";
  const fallbackSummary = intro
    .slice(headline ? 2 : 1)
    .filter((line) => !/@/.test(line) && !/^https?:\/\//i.test(line) && !/^\d+\s+(followers|connections)/i.test(line))
    .join(" ");

  return {
    personal: {
      name,
      headline,
      email: findEmail(allLines),
      phone: findPhone(allLines),
      location: findLocation(allLines),
      website: findWebsite(allLines),
    },
    summary: sections.summary.map(normalizeLine).filter(Boolean).join(" ") || fallbackSummary,
    skills: parseList(sections.skills),
    languages: parseList(sections.languages),
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    projects: parseProjects(sections.projects),
    certifications: parseCertifications(sections.certifications),
  };
}
