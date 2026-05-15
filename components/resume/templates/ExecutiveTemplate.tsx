import React from "react";
import type { ReactNode } from "react";
import type { ResumeData } from "@/lib/resume-types";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";

type Props = {
  data: ResumeData;
};

function Heading({ children, isDark = false }: { children: ReactNode; isDark?: boolean }) {
  return (
    <div className="mb-5">
      <h3
        className={`text-[12px] font-black uppercase tracking-[0.2em] ${
          isDark ? "text-white/90" : "text-slate-900"
        }`}
      >
        {children}
      </h3>
      <div
        className={`mt-1.5 h-[2px] w-8 ${isDark ? "bg-white/30" : "bg-[var(--resume-accent,#0f172a)]"}`}
      />
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <Heading isDark>{title}</Heading>
      <div className="text-[12.5px] text-white/80 leading-relaxed">{children}</div>
    </section>
  );
}

export function ExecutiveTemplate({ data }: Props) {
  const contacts = [
    { label: "Phone", value: data.personal.phone, icon: "📞" },
    { label: "Email", value: data.personal.email, icon: "✉️" },
    { label: "Location", value: data.personal.location, icon: "📍" },
    { label: "Website", value: data.personal.website, icon: "🌐" },
  ].filter((item) => item.value);

  const sectionsOrder = data.sectionsOrder || [
    "personal",
    "summary",
    "experience",
    "education",
    "skills-languages",
    "extras",
  ];

  return (
    <div className="flex flex-1 min-h-full bg-white font-sans text-slate-700 selection:bg-slate-200">
      {/* Sidebar: Elegant Deep Accent Background */}
      <aside
        className="w-[260px] flex-shrink-0 px-7 py-10 text-white"
        style={{ backgroundColor: "var(--resume-accent, #0f172a)" }}
      >
        <div className="mb-10 text-center md:text-left">
          {data.personal.image ? (
            <div className="mx-auto md:mx-0 aspect-square w-32 overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
              <img src={data.personal.image} alt="Profile" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="mx-auto md:mx-0 flex aspect-square w-24 items-center justify-center rounded-2xl bg-white/10 text-4xl font-bold text-white shadow-inner backdrop-blur-sm">
              {(data.personal.name || "?")[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {contacts.length > 0 && (
          <SidebarSection title="Contact">
            <div className="grid gap-3.5">
              {contacts.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {item.label}
                  </span>
                  <span className="break-all font-medium text-white/90 leading-snug">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {data.education.length > 0 && (
          <SidebarSection title="Education">
            <div className="grid gap-5">
              {data.education.map((item, index) => (
                <div key={`${item.school}-${index}`} className="relative flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/60 tracking-wide">
                    {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                  </span>
                  <h4 className="m-0 text-[13.5px] font-bold text-white leading-tight">
                    {item.school}
                  </h4>
                  <p className="m-0 text-[12.5px] font-medium text-white/70 italic">
                    {item.degree}
                  </p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {data.skills.length > 0 && (
          <SidebarSection title="Core Skills">
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {data.skills.map((item, idx) => (
                <SkillTag
                  key={`${item}-${idx}`}
                  skill={item}
                  style={data.skillLevelStyle}
                  variant="dark"
                />
              ))}
            </ul>
          </SidebarSection>
        )}

        {data.languages.length > 0 && (
          <SidebarSection title="Languages">
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {data.languages.map((item, idx) => (
                <SkillTag
                  key={`${item}-${idx}`}
                  skill={item}
                  style={data.skillLevelStyle}
                  variant="dark"
                />
              ))}
            </ul>
          </SidebarSection>
        )}
      </aside>

      {/* Main Content: Spacious and Sophisticated */}
      <main className="flex-1 min-w-0 px-10 py-12 flex flex-col">
        {/* Header */}
        <header className="mb-10 pb-8 border-b border-slate-100">
          <h1
            className="m-0 text-[42px] font-black tracking-tight text-slate-900 uppercase leading-[0.9]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {data.personal.name?.split(" ")[0]}{" "}
            <span
              className="font-light text-slate-500"
              style={{ color: "var(--resume-accent, #334155)" }}
            >
              {data.personal.name?.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          {data.personal.headline && (
            <p className="mt-3 m-0 text-[16px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              {data.personal.headline}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-9">
          {sectionsOrder.map((sectionKey) => {
            if (sectionKey === "summary" && data.summary) {
              return (
                <section key={sectionKey} className="animate-fadeIn">
                  <Heading>Executive Profile</Heading>
                  <RichTextBlock
                    value={data.summary}
                    className="text-[13px] leading-[1.7] text-slate-600 max-w-3xl whitespace-pre-line"
                  />
                </section>
              );
            }

            if (sectionKey === "experience" && data.experience.length > 0) {
              return (
                <section key={sectionKey}>
                  <Heading>Professional Experience</Heading>
                  <div className="flex flex-col gap-8">
                    {data.experience.map((item, index) => (
                      <div key={`${item.company}-${index}`} className="group relative">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-1.5">
                          <h4 className="m-0 text-[16px] font-extrabold text-slate-900">
                            {item.role}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                            {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                          </span>
                        </div>
                        <div
                          className="mb-3 text-[13.5px] font-bold"
                          style={{ color: "var(--resume-accent, #0f172a)" }}
                        >
                          {item.company}
                        </div>
                        <div className="text-[12.5px] leading-relaxed text-slate-600 border-l-2 border-slate-100 pl-4 ml-0.5 group-hover:border-[var(--resume-accent,#0f172a)] transition-colors">
                          <DescriptionList value={item.description} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionKey === "extras") {
              const hasProjects = data.projects.length > 0;
              const hasCerts = data.certifications.length > 0;

              if (!hasProjects && !hasCerts) return null;

              return (
                <React.Fragment key={sectionKey}>
                  {hasProjects && (
                    <section>
                      <Heading>Key Projects</Heading>
                      <div className="grid gap-6">
                        {data.projects.map((item, index) => (
                          <div key={`${item.name}-${index}`}>
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="m-0 text-[14px] font-bold text-slate-800">
                                {item.name}
                              </h4>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-slate-400 hover:text-slate-600 underline font-mono"
                                >
                                  View Project
                                </a>
                              )}
                            </div>
                            <RichTextBlock value={item.description} className="mt-1 text-[12px] text-slate-600 leading-relaxed" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {hasCerts && (
                    <section className="mt-1">
                      <Heading>Certifications & Awards</Heading>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.certifications.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="border border-slate-100 p-3.5 rounded-lg bg-slate-50/30"
                          >
                            <p className="m-0 font-bold text-slate-900 text-[13px]">
                              {item.name}
                            </p>
                            <p className="m-0 mt-1 text-[11px] text-slate-500 font-medium">
                              {item.issuer} {item.date ? `• ${item.date}` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>
      </main>
    </div>
  );
}
