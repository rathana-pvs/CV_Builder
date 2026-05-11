import type { ResumeData, TemplateId } from "@/lib/resume-types";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseSkill(skill: string) {
  const match = skill.match(/^(.+?)(?:\s*[\(:-]\s*(.+?)\s*\)?\s*)$/);
  if (match) {
    const name = match[1].trim();
    const level = match[2].trim().replace(/\)$/, "");
    return { name, level };
  }
  return { name: skill, level: null };
}

function renderSkillTag(skill: string, style: "line" | "stars" | "none" = "line", isDark = false, accent = "#2563eb") {
  const { name, level } = parseSkill(skill);

  if (!level || style === "none") {
    const pillClass = isDark
      ? "bg-white/15 text-white"
      : "border border-blue-100 bg-blue-50/10 text-slate-700";
    return `<li class="rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-block mb-1 mr-1 ${pillClass}">${escapeHtml(name)}</li>`;
  }

  let percentage = 0;
  let stars = 0;

  if (/native/i.test(level)) {
    percentage = 100;
    stars = 5;
  } else if (/expert/i.test(level)) {
    percentage = 90;
    stars = 5;
  } else if (/advanced/i.test(level)) {
    percentage = 80;
    stars = 4;
  } else if (/intermediate|medium|mid/i.test(level)) {
    percentage = 60;
    stars = 3;
  } else if (/beginner/i.test(level)) {
    percentage = 40;
    stars = 2;
  }

  const borderClass = isDark ? "border-b border-white/10" : "border-b border-slate-100/50";
  const nameClass = isDark ? "text-white" : "text-slate-800";
  const textClass = isDark ? "text-white" : "text-slate-700";

  let indicator = "";
  if (style === "line") {
    const bgClass = isDark ? "bg-white/20" : "bg-slate-100";
    const barStyle = isDark ? "background-color: white" : `background-color: ${accent}`;
    indicator = `
      <div class="w-[80px] h-1.5 rounded-full overflow-hidden flex-shrink-0 ${bgClass}">
        <div class="h-full rounded-full" style="width: ${percentage}%; ${barStyle}"></div>
      </div>
    `;
  } else if (style === "stars") {
    let starsHtml = "";
    for (let s = 1; s <= 5; s++) {
      const activeClass = s <= stars
        ? (isDark ? "text-white font-bold" : "text-amber-400 font-bold")
        : (isDark ? "text-white/20" : "text-slate-200");
      starsHtml += `<span class="${activeClass}">★</span>`;
    }
    indicator = `<div class="flex gap-0.5 text-[10px] items-center justify-end flex-shrink-0">${starsHtml}</div>`;
  }

  return `
    <li class="flex items-center justify-between text-[11px] font-medium py-1 w-full ${borderClass} ${textClass}">
      <span class="font-semibold truncate block pr-3 ${nameClass}">${escapeHtml(name)}</span>
      ${indicator}
    </li>
  `;
}

function renderDescriptionList(value?: string | null) {
  if (!value) return "";
  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return "";
  return `
    <ul class="mt-2 list-disc space-y-1 pl-5 text-[12px] text-slate-600">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderModern(data: ResumeData, accent: string) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const contactHtml = contacts.length > 0
    ? `<div class="mb-7">
        <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 border-b border-white/10 pb-2">Contact</h3>
        <div class="grid gap-1.5">
          ${contacts.map((c) => `<span class="text-[11px] text-white/80 break-all">${escapeHtml(c)}</span>`).join("")}
        </div>
       </div>`
    : "";

  const skillsHtml = data.skills.length > 0
    ? `<div class="mb-7">
        <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 border-b border-white/10 pb-2">Skills</h3>
        <ul class="list-none p-0 m-0">
          ${data.skills.map((item) => renderSkillTag(item, data.skillLevelStyle, true, accent)).join("")}
        </ul>
       </div>`
    : "";

  const languagesHtml = data.languages.length > 0
    ? `<div class="mb-7">
        <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 border-b border-white/10 pb-2">Languages</h3>
        <ul class="list-none p-0 m-0">
          ${data.languages.map((item) => renderSkillTag(item, data.skillLevelStyle, true, accent)).join("")}
        </ul>
       </div>`
    : "";

  const certsHtml = data.certifications.length > 0
    ? `<div>
        <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 border-b border-white/10 pb-2">Certifications</h3>
        <div class="grid gap-3">
          ${data.certifications.map((item) => `
            <div>
              <p class="m-0 text-[11px] font-bold text-white leading-snug">${escapeHtml(item.name)}</p>
              <p class="m-0 text-[10px] text-white/60 mt-0.5">
                ${[item.issuer, item.date].filter(Boolean).map(escapeHtml).join(" · ")}
              </p>
            </div>
          `).join("")}
        </div>
       </div>`
    : "";

  const imageHtml = data.personal.image
    ? `<div class="mb-5 w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
        <img src="${data.personal.image}" alt="Profile" class="w-full h-full object-cover" />
       </div>`
    : "";

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryHtml = data.summary ? `
    <section class="mb-7">
      <div class="flex items-center gap-3 mb-4">
        <span class="inline-block w-1 h-5 rounded-full flex-shrink-0" style="background: ${accent}"></span>
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Profile</h3>
      </div>
      <p class="m-0 text-slate-600 text-[13px]">${escapeHtml(data.summary)}</p>
    </section>
  ` : "";

  const expHtml = data.experience.length > 0 ? `
    <section class="mb-7">
      <div class="flex items-center gap-3 mb-4">
        <span class="inline-block w-1 h-5 rounded-full flex-shrink-0" style="background: ${accent}"></span>
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Experience</h3>
      </div>
      <div class="grid gap-5">
        ${data.experience.map((item) => `
          <div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.role)}</h4>
                <p class="m-0 mt-0.5 text-[11px] font-semibold" style="color: ${accent}">${escapeHtml(item.company)}</p>
              </div>
              ${(item.startDate || item.endDate) ? `
                <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
                </span>
              ` : ""}
            </div>
            ${renderDescriptionList(item.description)}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const eduHtml = data.education.length > 0 ? `
    <section class="mb-7">
      <div class="flex items-center gap-3 mb-4">
        <span class="inline-block w-1 h-5 rounded-full flex-shrink-0" style="background: ${accent}"></span>
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Education</h3>
      </div>
      <div class="grid gap-4">
        ${data.education.map((item) => `
          <div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.degree)}</h4>
                <p class="m-0 mt-0.5 text-[11px] font-semibold text-slate-500">${escapeHtml(item.school)}</p>
              </div>
              ${(item.startDate || item.endDate) ? `
                <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
                </span>
              ` : ""}
            </div>
            ${item.description ? `<p class="m-0 mt-1 text-[12px] text-slate-600">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const projectsHtml = data.projects.length > 0 ? `
    <section>
      <div class="flex items-center gap-3 mb-4">
        <span class="inline-block w-1 h-5 rounded-full flex-shrink-0" style="background: ${accent}"></span>
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Projects</h3>
      </div>
      <div class="grid gap-4">
        ${data.projects.map((item) => `
          <div>
            <div class="flex items-start gap-2">
              <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.name)}</h4>
              ${item.link ? `<span class="text-[10px] text-slate-400 mt-0.5">${escapeHtml(item.link)}</span>` : ""}
            </div>
            ${item.description ? `<p class="m-0 mt-1 text-[12px] text-slate-600">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  return `
    <div class="flex flex-1 min-h-full font-sans text-[13px] leading-relaxed text-slate-700">
      <aside class="w-[220px] flex-shrink-0 px-6 py-10 text-white" style="background: ${accent}">
        ${imageHtml}
        <div class="mb-8">
          <h2 class="m-0 text-xl font-black leading-tight text-white">${escapeHtml(data.personal.name || "Your Name")}</h2>
          <p class="mt-1.5 text-xs font-semibold text-white/70 leading-snug">${escapeHtml(data.personal.headline || "Professional Headline")}</p>
        </div>
        ${finalOrder.map(key => {
          if (key === "personal") return contactHtml;
          if (key === "skills-languages") return skillsHtml + languagesHtml;
          if (key === "extras") return certsHtml;
          return "";
        }).join("")}
      </aside>
      <main class="flex-1 px-8 py-10">
        ${finalOrder.map(key => {
          if (key === "summary") return summaryHtml;
          if (key === "experience") return expHtml;
          if (key === "education") return eduHtml;
          if (key === "extras") return projectsHtml;
          return "";
        }).join("")}
      </main>
    </div>
  `;
}

function renderMinimal(data: ResumeData, accent: string) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const imageHtml = data.personal.image
    ? `<div class="mb-4 flex justify-center">
        <div class="w-20 h-20 rounded-full overflow-hidden border border-slate-200">
          <img src="${data.personal.image}" alt="Profile" class="w-full h-full object-cover" />
        </div>
       </div>`
    : "";

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryHtml = data.summary ? `
    <section class="mt-8">
      <p class="m-0 text-center text-slate-500 italic text-[12.5px] leading-relaxed max-w-xl mx-auto">${escapeHtml(data.summary)}</p>
    </section>
  ` : "";

  const expHtml = data.experience.length > 0 ? `
    <section class="mb-8">
      <h3 class="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Experience</h3>
      <div class="grid gap-5">
        ${data.experience.map((item) => `
          <div>
            <div class="flex items-baseline justify-between gap-2">
              <h4 class="m-0 text-[13px] font-bold text-slate-900">${escapeHtml(item.role)}</h4>
              <span class="text-[10px] text-slate-400 whitespace-nowrap">
                ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
              </span>
            </div>
            <p class="m-0 mt-0.5 text-[11px] text-slate-500 font-medium">${escapeHtml(item.company)}</p>
            ${renderDescriptionList(item.description)}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const projectsHtml = data.projects.length > 0 ? `
    <section>
      <h3 class="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Projects</h3>
      <div class="grid gap-4">
        ${data.projects.map((item) => `
          <div>
            <h4 class="m-0 text-[13px] font-bold text-slate-900">${escapeHtml(item.name)}</h4>
            ${item.link ? `<p class="m-0 text-[11px] text-slate-400">${escapeHtml(item.link)}</p>` : ""}
            ${item.description ? `<p class="m-0 mt-1 text-[12px] text-slate-600">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const skillsHtml = data.skills.length > 0 ? `
    <section class="mb-7">
      <h3 class="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Skills</h3>
      <ul class="list-none p-0 m-0">
        ${data.skills.map((item) => renderSkillTag(item, data.skillLevelStyle, false, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const langHtml = data.languages.length > 0 ? `
    <section class="mb-7">
      <h3 class="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Languages</h3>
      <ul class="list-none p-0 m-0">
        ${data.languages.map((item) => renderSkillTag(item, data.skillLevelStyle, false, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const eduHtml = data.education.length > 0 ? `
    <section class="mb-7">
      <h3 class="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Education</h3>
      <div class="grid gap-3">
        ${data.education.map((item) => `
          <div>
            <p class="m-0 text-[12px] font-bold text-slate-900 leading-snug">${escapeHtml(item.degree)}</p>
            <p class="m-0 text-[11px] text-slate-500">${escapeHtml(item.school)}</p>
            <p class="m-0 text-[10px] text-slate-400">
              ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
            </p>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const certHtml = data.certifications.length > 0 ? `
    <section>
      <h3 class="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]" style="color: ${accent}">Certifications</h3>
      <div class="grid gap-2">
        ${data.certifications.map((item) => `
          <div>
            <p class="m-0 text-[11px] font-bold text-slate-800 leading-snug">${escapeHtml(item.name)}</p>
            <p class="m-0 text-[10px] text-slate-400">
              ${[item.issuer, item.date].filter(Boolean).map(escapeHtml).join(" · ")}
            </p>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  return `
    <div class="flex flex-col flex-1 font-sans text-[13px] leading-relaxed text-slate-700 bg-white min-h-full">
      <header class="text-center px-16 pt-12 pb-8 border-b-2 border-slate-900">
        ${imageHtml}
        <h2 class="m-0 text-[32px] font-light tracking-[0.12em] text-slate-900 uppercase">${escapeHtml(data.personal.name || "Your Name")}</h2>
        <p class="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style="color: ${accent}">${escapeHtml(data.personal.headline || "Professional Headline")}</p>
        ${contacts.length > 0 ? `
          <div class="mt-3 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            ${contacts.map((c, i) => `
              <span class="flex items-center gap-4">
                ${i > 0 ? `<span class="text-slate-300">·</span>` : ""}
                ${escapeHtml(c)}
              </span>
            `).join("")}
          </div>
        ` : ""}
      </header>
      <div class="px-16 pb-12">
        ${summaryHtml}
        <div class="my-5 border-t border-slate-100"></div>
        <div class="grid grid-cols-[1fr_200px] gap-10">
          <div>
            ${finalOrder.map(key => {
              if (key === "experience") return expHtml;
              if (key === "extras") return projectsHtml;
              return "";
            }).join("")}
          </div>
          <div>
            ${finalOrder.map(key => {
              if (key === "skills-languages") return skillsHtml + langHtml;
              if (key === "education") return eduHtml;
              if (key === "extras") return certHtml;
              return "";
            }).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCorporate(data: ResumeData, accent: string) {
  const contacts = [
    data.personal.email && { icon: "✉", label: data.personal.email },
    data.personal.phone && { icon: "✆", label: data.personal.phone },
    data.personal.location && { icon: "⌖", label: data.personal.location },
    data.personal.website && { icon: "⊕", label: data.personal.website },
  ].filter((c): c is { icon: string; label: string } => !!c);

  const imageHtml = data.personal.image
    ? `<div class="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-slate-50">
        <img src="${data.personal.image}" alt="Profile" class="w-full h-full object-cover" />
       </div>`
    : "";

  const sectionHeading = (label: string) => `
    <div class="flex items-center gap-3 mb-5 border-b border-slate-100 pb-2">
      <span class="inline-block w-1.5 h-4 rounded-sm flex-shrink-0" style="background: ${accent}"></span>
      <h3 class="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-slate-800">${label}</h3>
    </div>
  `;

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryHtml = data.summary ? `
    <section class="mb-8">
      ${sectionHeading("Profile")}
      <p class="m-0 text-slate-600 text-[12px] leading-[1.7] text-justify">${escapeHtml(data.summary)}</p>
    </section>
  ` : "";

  const expHtml = data.experience.length > 0 ? `
    <section class="mb-8">
      ${sectionHeading("Employment History")}
      <div class="flex flex-col gap-6">
        ${data.experience.map((item) => `
          <div class="relative">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h4 class="m-0 font-bold text-slate-950 text-[13px] leading-snug">${escapeHtml(item.role)}</h4>
                <p class="m-0 mt-0.5 text-[11px] font-extrabold" style="color: ${accent}">${escapeHtml(item.company)}</p>
              </div>
              ${(item.startDate || item.endDate) ? `
                <span class="text-[10px] text-slate-400 font-semibold whitespace-nowrap mt-0.5 border border-slate-100 px-2 py-0.5 rounded bg-slate-50/50">
                  ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
                </span>
              ` : ""}
            </div>
            ${renderDescriptionList(item.description)}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const projectsHtml = data.projects.length > 0 ? `
    <section>
      ${sectionHeading("Projects")}
      <div class="flex flex-col gap-5">
        ${data.projects.map((item) => `
          <div class="relative">
            <div class="flex items-baseline gap-2 flex-wrap">
              <h4 class="m-0 font-bold text-slate-950 text-[13px]">${escapeHtml(item.name)}</h4>
              ${item.link ? `<span class="text-[10px] text-slate-400 font-medium font-mono">${escapeHtml(item.link)}</span>` : ""}
            </div>
            ${item.description ? `<p class="m-0 mt-1.5 text-[11.5px] text-slate-600 leading-relaxed">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const skillsHtml = data.skills.length > 0 ? `
    <section class="mb-8">
      ${sectionHeading("Skills")}
      <ul class="list-none p-0 m-0">
        ${data.skills.map((item) => renderSkillTag(item, data.skillLevelStyle, false, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const languagesHtml = data.languages.length > 0 ? `
    <section class="mb-8">
      ${sectionHeading("Languages")}
      <ul class="list-none p-0 m-0">
        ${data.languages.map((item) => renderSkillTag(item, data.skillLevelStyle, false, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const eduHtml = data.education.length > 0 ? `
    <section class="mb-8">
      ${sectionHeading("Education")}
      <div class="flex flex-col gap-5">
        ${data.education.map((item) => `
          <div class="text-[11.5px]">
            <p class="m-0 font-bold text-slate-950 leading-snug">${escapeHtml(item.degree)}</p>
            <p class="m-0 text-[11px] text-slate-500 mt-0.5">${escapeHtml(item.school)}</p>
            <p class="m-0 text-[10px] text-slate-400 font-semibold mt-1">
              ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
            </p>
            ${item.description ? `<p class="m-0 mt-1.5 text-[11px] text-slate-500 leading-normal">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const certHtml = data.certifications.length > 0 ? `
    <section>
      ${sectionHeading("Certifications")}
      <div class="flex flex-col gap-4">
        ${data.certifications.map((item) => `
          <div class="text-[11.5px]">
            <p class="m-0 font-bold text-slate-900 leading-snug">${escapeHtml(item.name)}</p>
            <p class="m-0 text-[10px] text-slate-400 font-semibold mt-0.5">
              ${[item.issuer, item.date].filter(Boolean).map(escapeHtml).join(" · ")}
            </p>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  return `
    <div class="flex flex-col flex-1 font-sans text-[12.5px] leading-relaxed text-slate-600 min-h-full bg-white">
      <header class="px-10 pt-10 pb-8 border-b border-slate-100 relative">
        <div class="absolute top-0 left-0 right-0 h-1.5" style="background: ${accent}"></div>
        <div class="flex items-start justify-between gap-6">
          <div class="flex-1">
            <h1 class="m-0 text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
              ${escapeHtml(data.personal.name || "Your Name")}
            </h1>
            ${data.personal.headline ? `
              <p class="mt-2.5 m-0 text-xs font-extrabold uppercase tracking-[0.15em]" style="color: ${accent}">
                ${escapeHtml(data.personal.headline)}
              </p>
            ` : ""}
            ${contacts.length > 0 ? `
              <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                ${contacts.map((c) => `
                  <span class="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span class="opacity-60 text-slate-400 font-bold">${c.icon}</span>
                    <span class="font-medium">${escapeHtml(c.label)}</span>
                  </span>
                `).join("")}
              </div>
            ` : ""}
          </div>
          ${imageHtml}
        </div>
      </header>

      <div class="grid grid-cols-[1fr_220px] flex-1">
        <main class="px-10 py-8 border-r border-slate-100">
          ${finalOrder.map(key => {
            if (key === "summary") return summaryHtml;
            if (key === "experience") return expHtml;
            if (key === "extras") return projectsHtml;
            return "";
          }).join("")}
        </main>

        <aside class="px-6 py-8 bg-slate-50/50">
          ${finalOrder.map(key => {
            if (key === "skills-languages") return skillsHtml + languagesHtml;
            if (key === "education") return eduHtml;
            if (key === "extras") return certHtml;
            return "";
          }).join("")}
        </aside>
      </div>
    </div>
  `;
}


function renderSea(data: ResumeData, accent: string) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const nameInitial = (data.personal.name || "?")[0]?.toUpperCase();
  const imageHtml = data.personal.image
    ? `<div class="w-16 h-16 rounded-full overflow-hidden mb-3 shadow-lg border border-white/20">
        <img src="${data.personal.image}" alt="Profile" class="w-full h-full object-cover" />
       </div>`
    : `<div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-lg" style="background: rgba(255,255,255,0.15)">
        ${nameInitial}
       </div>`;

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const contactHtml = contacts.length > 0 ? `
    <section class="mb-6">
      <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/50 border-b border-white/10 pb-1.5">Contact</h3>
      <div class="grid gap-1.5">
        ${contacts.map((c) => `<span class="text-[10px] text-white/75 break-all leading-snug">${escapeHtml(c)}</span>`).join("")}
      </div>
    </section>
  ` : "";

  const skillsHtml = data.skills.length > 0 ? `
    <section class="mb-6">
      <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/50 border-b border-white/10 pb-1.5">Skills</h3>
      <ul class="list-none p-0 m-0">
        ${data.skills.map((item) => renderSkillTag(item, data.skillLevelStyle, true, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const languagesHtml = data.languages.length > 0 ? `
    <section class="mb-6">
      <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/50 border-b border-white/10 pb-1.5">Languages</h3>
      <ul class="list-none p-0 m-0">
        ${data.languages.map((item) => renderSkillTag(item, data.skillLevelStyle, true, accent)).join("")}
      </ul>
    </section>
  ` : "";

  const certHtml = data.certifications.length > 0 ? `
    <section class="mb-6">
      <h3 class="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/50 border-b border-white/10 pb-1.5">Certifications</h3>
      <div class="grid gap-2">
        ${data.certifications.map((item) => `
          <div>
            <p class="m-0 text-[10px] font-bold text-white leading-snug">${escapeHtml(item.name)}</p>
            <p class="m-0 text-[9px] text-white/50 mt-0.5">
              ${[item.issuer, item.date].filter(Boolean).map(escapeHtml).join(" · ")}
            </p>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const summaryHtml = data.summary ? `
    <section class="mb-7">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">About</h3>
        <div class="flex-1 h-px bg-slate-100"></div>
      </div>
      <p class="m-0 text-slate-600 text-[12.5px] leading-relaxed">${escapeHtml(data.summary)}</p>
    </section>
  ` : "";

  const expHtml = data.experience.length > 0 ? `
    <section class="mb-7">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Experience</h3>
        <div class="flex-1 h-px bg-slate-100"></div>
      </div>
      <div class="grid gap-5">
        ${data.experience.map((item) => `
          <div class="flex gap-3">
            <div class="flex flex-col items-center pt-1 flex-shrink-0">
              <div class="w-2 h-2 rounded-full flex-shrink-0" style="background: ${accent}"></div>
              <div class="w-px flex-1 bg-slate-100 mt-1"></div>
            </div>
            <div class="flex-1 pb-2">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.role)}</h4>
                  <p class="m-0 mt-0.5 text-[11px] font-semibold" style="color: ${accent}">${escapeHtml(item.company)}</p>
                </div>
                ${(item.startDate || item.endDate) ? `
                  <span class="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                    ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
                  </span>
                ` : ""}
              </div>
              ${renderDescriptionList(item.description)}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const eduHtml = data.education.length > 0 ? `
    <section class="mb-7">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Education</h3>
        <div class="flex-1 h-px bg-slate-100"></div>
      </div>
      <div class="grid gap-4">
        ${data.education.map((item) => `
          <div class="flex gap-3">
            <div class="flex flex-col items-center pt-1 flex-shrink-0">
              <div class="w-2 h-2 rounded-full flex-shrink-0" style="background: ${accent}"></div>
            </div>
            <div>
              <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.degree)}</h4>
              <p class="m-0 mt-0.5 text-[11px] text-slate-500">${escapeHtml(item.school)}</p>
              <p class="m-0 text-[10px] text-slate-400">
                ${[item.startDate, item.endDate].filter(Boolean).map(escapeHtml).join(" – ")}
              </p>
              ${item.description ? `<p class="m-0 mt-1 text-[12px] text-slate-600">${escapeHtml(item.description)}</p>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  const projectsHtml = data.projects.length > 0 ? `
    <section>
      <div class="flex items-center gap-2 mb-4">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Projects</h3>
        <div class="flex-1 h-px bg-slate-100"></div>
      </div>
      <div class="grid gap-4">
        ${data.projects.map((item) => `
          <div>
            <div class="flex items-center gap-2">
              <h4 class="m-0 font-bold text-slate-900 text-[13px]">${escapeHtml(item.name)}</h4>
              ${item.link ? `<span class="text-[10px] text-slate-400">${escapeHtml(item.link)}</span>` : ""}
            </div>
            ${item.description ? `<p class="m-0 mt-1 text-[12px] text-slate-600">${escapeHtml(item.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";

  return `
    <div class="flex flex-1 min-h-full font-sans text-[13px] leading-relaxed text-slate-700">
      <aside class="w-[205px] flex-shrink-0 px-5 py-9 flex flex-col" style="background: linear-gradient(160deg, ${accent} 0%, color-mix(in srgb, ${accent} 70%, #000) 100%)">
        <div class="mb-6 flex flex-col items-center text-center">
          ${imageHtml}
          <h2 class="m-0 text-base font-black leading-tight text-white">${escapeHtml(data.personal.name || "Your Name")}</h2>
          <p class="mt-1 text-[10px] font-semibold text-white/60 leading-snug">${escapeHtml(data.personal.headline || "Professional Headline")}</p>
        </div>
        ${finalOrder.map(key => {
          if (key === "personal") return contactHtml;
          if (key === "skills-languages") return skillsHtml + languagesHtml;
          if (key === "extras") return certHtml;
          return "";
        }).join("")}
      </aside>
      <main class="flex-1 px-8 py-9 bg-white">
        ${finalOrder.map(key => {
          if (key === "summary") return summaryHtml;
          if (key === "experience") return expHtml;
          if (key === "education") return eduHtml;
          if (key === "extras") return projectsHtml;
          return "";
        }).join("")}
      </main>
    </div>
  `;
}

function renderCreative(data: ResumeData, accent: string) {
  const avatarHtml = data.personal.image
    ? `<div class="w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white/25 shadow-lg flex-shrink-0">
         <img src="${data.personal.image}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />
       </div>`
    : `<div class="w-[72px] h-[72px] rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-lg border border-white/15 flex-shrink-0" style="background:rgba(255,255,255,0.12)">
         ${escapeHtml((data.personal.name || "?")[0]?.toUpperCase())}
       </div>`;

  const renderSkillBar = (skillStr: string, pctMap: Record<string, number>) => {
    const match = skillStr.match(/^(.+?)(?:\s*[\(:-]\s*(.+?)\s*\)?\s*)$/);
    const name = match ? match[1].trim() : skillStr;
    const level = match ? match[2].trim() : null;
    const pct = level ? (pctMap[level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()] ?? 70) : null;
    if (pct === null) {
      return `<li class="rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-block mb-1 mr-1 border border-slate-200 bg-slate-50 text-slate-700">${escapeHtml(name)}</li>`;
    }
    return `<li class="flex items-center justify-between text-[11px] font-medium py-1 w-full border-b border-slate-100 last:border-0 text-slate-700">
      <span class="font-semibold truncate block pr-3 text-slate-800">${escapeHtml(name)}</span>
      <div class="w-[80px] h-1.5 rounded-full overflow-hidden flex-shrink-0 bg-slate-100">
        <div class="h-full rounded-full" style="width:${pct}%;background-color:${accent}"></div>
      </div>
    </li>`;
  };

  const skillPctMap: Record<string, number> = { Expert: 100, Advanced: 80, Intermediate: 60, Beginner: 40 };
  const langPctMap: Record<string, number> = { Native: 100, Expert: 90, Advanced: 75, Intermediate: 55, Beginner: 35 };

  const skillsHtml = data.skills.length > 0
    ? `<div class="mb-6">
        <h3 class="m-0 mb-2 text-[8.5px] font-black uppercase tracking-[0.22em]" style="color:${accent}">Skills</h3>
        <div class="h-px w-6 mb-3" style="background-color:${accent};opacity:0.25"></div>
        <ul class="list-none p-0 m-0">${data.skills.map((s) => renderSkillBar(s, skillPctMap)).join("")}</ul>
       </div>` : "";

  const langHtml = data.languages.length > 0
    ? `<div class="mb-6">
        <h3 class="m-0 mb-2 text-[8.5px] font-black uppercase tracking-[0.22em]" style="color:${accent}">Languages</h3>
        <div class="h-px w-6 mb-3" style="background-color:${accent};opacity:0.25"></div>
        <ul class="list-none p-0 m-0">${data.languages.map((s) => renderSkillBar(s, langPctMap)).join("")}</ul>
       </div>` : "";

  const certHtml = data.certifications.length > 0
    ? `<div>
        <h3 class="m-0 mb-2 text-[8.5px] font-black uppercase tracking-[0.22em]" style="color:${accent}">Certifications</h3>
        <div class="h-px w-6 mb-3" style="background-color:${accent};opacity:0.25"></div>
        <div style="display:grid;gap:10px">
          ${data.certifications.map((c) => `
            <div>
              <p class="m-0 text-[10.5px] font-bold leading-snug" style="color:${accent}">${escapeHtml(c.name)}</p>
              ${(c.issuer || c.date) ? `<p class="m-0 mt-0.5 text-[9.5px] text-slate-400">${[c.issuer, c.date].filter(Boolean).map(escapeHtml).join(" · ")}</p>` : ""}
            </div>`).join("")}
        </div>
       </div>` : "";

  const sectionTitle = (label: string) =>
    `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;margin-top:4px">
      <span class="text-[9px] font-black uppercase tracking-[0.2em]" style="color:${accent}">${label}</span>
      <div class="flex-1 h-px" style="background-color:${accent};opacity:0.2"></div>
     </div>`;

  const timelineEntry = (inner: string, isLast: boolean) =>
    `<div style="display:flex;gap:14px">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding-top:3px">
        <div style="width:7px;height:7px;border-radius:50%;background-color:${accent};box-shadow:0 0 0 2px #fff;flex-shrink:0"></div>
        ${!isLast ? `<div style="width:1px;flex:1;margin-top:4px;background-color:${accent};opacity:0.15"></div>` : ""}
      </div>
      <div style="flex:1;padding-bottom:18px">${inner}</div>
     </div>`;

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryHtml = data.summary ? `
    <section style="margin-bottom:22px">
      ${sectionTitle("Profile")}
      <p style="margin:0;font-size:12px;color:#475569;line-height:1.7">${escapeHtml(data.summary)}</p>
    </section>` : "";

  const expHtml = data.experience.length > 0 ? `
    <section style="margin-bottom:22px">
      ${sectionTitle("Employment History")}
      <div>
        ${data.experience.map((exp, idx) => timelineEntry(`
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <div>
              <h4 style="margin:0;font-size:12.5px;font-weight:700;color:#0f172a;line-height:1.3">${escapeHtml(exp.role)}</h4>
              <p style="margin:2px 0 0;font-size:11px;font-weight:600;color:${accent}">${escapeHtml(exp.company)}</p>
            </div>
            ${(exp.startDate || exp.endDate) ? `<span style="font-size:10px;color:#94a3b8;font-weight:500;white-space:nowrap;margin-top:2px;flex-shrink:0">${[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>` : ""}
          </div>
          ${exp.description ? renderDescriptionList(exp.description) : ""}
        `, idx === data.experience.length - 1)).join("")}
      </div>
    </section>` : "";

  const eduHtml = data.education.length > 0 ? `
    <section style="margin-bottom:22px">
      ${sectionTitle("Education")}
      <div>
        ${data.education.map((edu, idx) => timelineEntry(`
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <div>
              <h4 style="margin:0;font-size:12.5px;font-weight:700;color:#0f172a;line-height:1.3">${escapeHtml(edu.degree)}</h4>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;font-weight:500">${escapeHtml(edu.school)}</p>
            </div>
            ${(edu.startDate || edu.endDate) ? `<span style="font-size:10px;color:#94a3b8;font-weight:500;white-space:nowrap;margin-top:2px;flex-shrink:0">${[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>` : ""}
          </div>
          ${edu.description ? `<p style="margin:4px 0 0;font-size:11.5px;color:#475569">${escapeHtml(edu.description)}</p>` : ""}
        `, idx === data.education.length - 1)).join("")}
      </div>
    </section>` : "";

  const projectsHtml = data.projects.length > 0 ? `
    <section>
      ${sectionTitle("Projects")}
      <div style="display:grid;gap:14px">
        ${data.projects.map((proj) => `
          <div style="padding-left:14px;border-left:2px solid ${accent}">
            <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
              <h4 style="margin:0;font-size:12.5px;font-weight:700;color:#0f172a">${escapeHtml(proj.name)}</h4>
              ${proj.link ? `<span style="font-size:10px;color:#94a3b8">${escapeHtml(proj.link)}</span>` : ""}
            </div>
            ${proj.description ? `<p style="margin:4px 0 0;font-size:11.5px;color:#475569;line-height:1.6">${escapeHtml(proj.description)}</p>` : ""}
          </div>`).join("")}
      </div>
    </section>` : "";

  return `
    <div class="flex flex-col flex-1 min-h-full font-sans text-slate-700 bg-white" style="font-size:12.5px;line-height:1.6">

      <!-- HERO HEADER -->
      <header class="relative overflow-hidden" style="padding:36px 40px 28px;display:flex;align-items:center;gap:22px;background:linear-gradient(105deg,${accent} 0%, color-mix(in srgb,${accent} 82%,#000) 100%)">
        <div style="position:absolute;right:-48px;top:-48px;width:192px;height:192px;border-radius:50%;background:#fff;opacity:0.07"></div>
        <div style="position:absolute;right:96px;bottom:-32px;width:112px;height:112px;border-radius:50%;background:#fff;opacity:0.05"></div>
        ${avatarHtml}
        <div style="position:relative;z-index:10;flex:1">
          <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;line-height:1.2;letter-spacing:-0.3px">${escapeHtml(data.personal.name || "Your Name")}</h1>
          ${data.personal.headline ? `<p style="margin:4px 0 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.18em">${escapeHtml(data.personal.headline)}</p>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:10px">
            ${data.personal.email ? `<span style="font-size:10px;color:rgba(255,255,255,0.7)">✉ ${escapeHtml(data.personal.email)}</span>` : ""}
            ${data.personal.phone ? `<span style="font-size:10px;color:rgba(255,255,255,0.7)">✆ ${escapeHtml(data.personal.phone)}</span>` : ""}
            ${data.personal.location ? `<span style="font-size:10px;color:rgba(255,255,255,0.7)">⌖ ${escapeHtml(data.personal.location)}</span>` : ""}
            ${data.personal.website ? `<span style="font-size:10px;color:rgba(255,255,255,0.7)">⊕ ${escapeHtml(data.personal.website)}</span>` : ""}
          </div>
        </div>
      </header>

      <!-- BODY -->
      <div style="display:flex;flex:1;min-height:0">

        <!-- SIDEBAR -->
        <aside style="width:190px;flex-shrink:0;padding:28px 24px;border-right:1px solid #f1f5f9;background:#f8fafc">
          ${finalOrder.map(key => {
            if (key === "skills-languages") return skillsHtml + langHtml;
            if (key === "extras") return certHtml;
            return "";
          }).join("")}
        </aside>

        <!-- MAIN -->
        <main style="flex:1;padding:28px 32px;overflow:hidden">
          ${finalOrder.map(key => {
            if (key === "summary") return summaryHtml;
            if (key === "experience") return expHtml;
            if (key === "education") return eduHtml;
            if (key === "extras") return projectsHtml;
            return "";
          }).join("")}
        </main>
      </div>
    </div>
  `;
}

export function renderResumeHtml(data: ResumeData, template: TemplateId, accent?: string) {
  let activeAccent = accent || data.color;
  if (!activeAccent) {
    if (template === "corporate") activeAccent = "#059669";
    else if (template === "sea") activeAccent = "#0d9488";
    else activeAccent = "#2563eb";
  }

  let htmlContent = "";
  if (template === "modern") {
    htmlContent = renderModern(data, activeAccent);
  } else if (template === "minimal") {
    htmlContent = renderMinimal(data, activeAccent);
  } else if (template === "corporate") {
    htmlContent = renderCorporate(data, activeAccent);
  } else if (template === "sea") {
    htmlContent = renderSea(data, activeAccent);
  } else if (template === "creative") {
    htmlContent = renderCreative(data, activeAccent);
  } else {
    htmlContent = renderModern(data, activeAccent);
  }

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    :root {
      --resume-accent: ${activeAccent};
    }
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 794px;
      min-height: 1123px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body class="bg-white">
  <div class="page-container">
    ${htmlContent}
  </div>
</body>
</html>`;
}
