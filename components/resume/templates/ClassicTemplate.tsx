import React from "react";
import type { ReactNode } from "react";
import type { ResumeData } from "@/lib/resume-types";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";

type Props = {
  data: ResumeData;
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 mt-6 first:mt-0">
      <h3 className="m-0 text-[13px] font-extrabold uppercase tracking-[0.2em] text-slate-900 font-sans flex items-center gap-3">
        {children}
        <span className="flex-1 h-[1px] bg-slate-200" />
      </h3>
    </div>
  );
}

function Entry({
  title,
  subtitle,
  date,
  location,
  description,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  description?: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="m-0 text-[14px] font-bold text-slate-900 font-serif">{title}</h4>
        {date && (
          <span className="text-[12px] font-semibold text-slate-600 tabular-nums font-sans">
            {date}
          </span>
        )}
      </div>
      {(subtitle || location) && (
        <div className="flex items-baseline justify-between gap-4 mt-0.5 text-[13px] font-medium">
          {subtitle && <span className="text-slate-700 italic">{subtitle}</span>}
          {location && <span className="text-slate-500 text-[12px] font-sans">{location}</span>}
        </div>
      )}
      {description && (
        <div className="mt-2 text-[12.5px] leading-[1.6] text-slate-600 pl-1">
          <DescriptionList value={description} />
        </div>
      )}
    </div>
  );
}

export function ClassicTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, languages, projects, certifications } = data;

  const contacts = [
    personal.phone ? { label: "Phone", value: personal.phone, icon: "☎" } : null,
    personal.email ? { label: "Email", value: personal.email, icon: "✉" } : null,
    personal.location ? { label: "Location", value: personal.location, icon: "📍" } : null,
    personal.website ? { label: "Web", value: personal.website, icon: "🔗" } : null,
  ].filter((item): item is { label: string; value: string; icon: string } => !!item);

  const sectionsOrder = Array.isArray(data.sectionsOrder) && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : [
        "personal",
        "summary",
        "experience",
        "education",
        "skills-languages",
        "extras",
      ];

  return (
    <div className="flex flex-1 min-h-full flex-col bg-white px-[60px] py-[60px] font-serif text-slate-800 antialiased selection:bg-slate-100">
      {/* Elegant Centered Header */}
      <header className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-6 mb-6">
        {personal.image && (
          <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm">
            <img src={personal.image} alt="Profile" className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className="m-0 text-[34px] font-black tracking-tight text-slate-900 uppercase leading-tight">
          {personal.name || "Your Name"}
        </h1>
        {personal.headline && (
          <p className="m-0 mt-1 text-[15px] font-medium uppercase tracking-[0.15em] text-slate-600 font-sans">
            {personal.headline}
          </p>
        )}

        {contacts.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12.5px] text-slate-600 font-sans font-medium">
            {contacts.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <span className="text-slate-300 select-none">•</span>}
                <span className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px]">{item.icon}</span>
                  {item.value}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Dynamic Sections Content */}
      <div className="flex flex-col gap-2 flex-1">
        {sectionsOrder.map((sectionKey) => {
          if (sectionKey === "summary" && summary) {
            return (
              <section key={sectionKey}>
                <SectionTitle>Professional Summary</SectionTitle>
                <RichTextBlock
                  value={summary}
                  className="m-0 text-[13px] leading-[1.7] text-slate-600 text-justify font-serif whitespace-pre-line pl-1"
                />
              </section>
            );
          }

          if (sectionKey === "experience" && experience.length > 0) {
            return (
              <section key={sectionKey}>
                <SectionTitle>Professional Experience</SectionTitle>
                <div className="flex flex-col gap-4 pl-1">
                  {experience.map((item, index) => (
                    <Entry
                      key={`${item.company}-${index}`}
                      title={item.role || "Role"}
                      subtitle={item.company}
                      date={[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                      description={item.description}
                    />
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === "education" && education.length > 0) {
            return (
              <section key={sectionKey}>
                <SectionTitle>Education</SectionTitle>
                <div className="flex flex-col gap-4 pl-1">
                  {education.map((item, index) => (
                    <Entry
                      key={`${item.school}-${index}`}
                      title={item.degree || "Degree"}
                      subtitle={item.school}
                      date={[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                      description={item.description}
                    />
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === "skills-languages" && (skills.length > 0 || languages.length > 0)) {
            return (
              <section key={sectionKey}>
                <SectionTitle>Skills & Languages</SectionTitle>
                <div className="pl-1 grid gap-3">
                  {skills.length > 0 && (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[12.5px] font-bold text-slate-800 font-sans min-w-[100px] uppercase tracking-wider text-[10px]">
                        Technical Skills:
                      </span>
                      <ul className="m-0 flex flex-wrap list-none gap-x-1.5 gap-y-1 p-0 flex-1">
                        {skills.map((item, index) => (
                          <SkillTag
                            key={`${item}-${index}`}
                            skill={item}
                            style={data.skillLevelStyle || "none"}
                            variant="light"
                          />
                        ))}
                      </ul>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[12.5px] font-bold text-slate-800 font-sans min-w-[100px] uppercase tracking-wider text-[10px]">
                        Languages:
                      </span>
                      <ul className="m-0 flex flex-wrap list-none gap-x-1.5 gap-y-1 p-0 flex-1">
                        {languages.map((item, index) => (
                          <SkillTag
                            key={`${item}-${index}`}
                            skill={item}
                            style={data.skillLevelStyle || "none"}
                            variant="light"
                          />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (sectionKey === "extras") {
            const hasProjects = projects.length > 0;
            const hasCerts = certifications.length > 0;

            if (!hasProjects && !hasCerts) return null;

            return (
              <React.Fragment key={sectionKey}>
                {hasProjects && (
                  <section>
                    <SectionTitle>Projects & Achievements</SectionTitle>
                    <div className="flex flex-col gap-4 pl-1">
                      {projects.map((item, index) => (
                        <div key={`${item.name}-${index}`}>
                          <div className="flex items-baseline justify-between gap-4">
                            <h4 className="m-0 text-[14px] font-bold text-slate-900 font-serif flex items-center gap-2">
                              {item.name}
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-slate-400 hover:text-slate-600 font-sans font-medium underline"
                                >
                                  [link]
                                </a>
                              )}
                            </h4>
                          </div>
                          <RichTextBlock value={item.description} className="mt-1 text-[12.5px] leading-relaxed text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {hasCerts && (
                  <section>
                    <SectionTitle>Certifications</SectionTitle>
                    <ul className="m-0 list-disc pl-5 text-[12.5px] text-slate-600 flex flex-col gap-1.5 pl-6">
                      {certifications.map((item, index) => (
                        <li key={`${item.name}-${index}`}>
                          <span className="font-bold text-slate-800">{item.name}</span>
                          {item.issuer && <span className="text-slate-500"> — {item.issuer}</span>}
                          {item.date && <span className="text-slate-400 text-[11px] italic ml-1">({item.date})</span>}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </React.Fragment>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
