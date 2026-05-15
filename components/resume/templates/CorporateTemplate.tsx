import React from "react";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";
import type { ResumeData } from "@/lib/resume-types";

type Props = {
  data: ResumeData;
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-2">
      <span
        className="inline-block w-1.5 h-4 rounded-sm flex-shrink-0"
        style={{ background: "var(--resume-accent, #059669)" }}
      />
      <h3 className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-slate-800">
        {children}
      </h3>
    </div>
  );
}

export function CorporateTemplate({ data }: Props) {
  const { personal, summary, skills, languages, experience, education, projects, certifications } =
    data;

  const contacts = [
    personal.email && { icon: "✉", label: personal.email },
    personal.phone && { icon: "✆", label: personal.phone },
    personal.location && { icon: "⌖", label: personal.location },
    personal.website && { icon: "⊕", label: personal.website },
  ].filter((c): c is { icon: string; label: string } => !!c);

  const finalOrder = data.sectionsOrder && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryEl = summary ? (
    <section className="mb-8">
      <SectionHeading>Profile</SectionHeading>
      <RichTextBlock value={summary} className="m-0 text-slate-600 text-[12px] leading-[1.7] text-justify" />
    </section>
  ) : null;

  const experienceEl = experience.length > 0 ? (
    <section className="mb-8">
      <SectionHeading>Employment History</SectionHeading>
      <div className="flex flex-col gap-6">
        {experience.map((item, index) => (
          <div key={`${item.company}-${index}`} className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h4 className="m-0 font-bold text-slate-950 text-[13px] leading-snug">
                  {item.role}
                </h4>
                <p
                  className="m-0 mt-0.5 text-[11px] font-extrabold"
                  style={{ color: "var(--resume-accent, #059669)" }}
                >
                  {item.company}
                </p>
              </div>
              {(item.startDate || item.endDate) && (
                <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap mt-0.5 border border-slate-100 px-2 py-0.5 rounded bg-slate-50/50">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </span>
              )}
            </div>
            <DescriptionList value={item.description} />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const projectsEl = projects.length > 0 ? (
    <section>
      <SectionHeading>Projects</SectionHeading>
      <div className="flex flex-col gap-5">
        {projects.map((item, index) => (
          <div key={`${item.name}-${index}`} className="relative">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h4 className="m-0 font-bold text-slate-950 text-[13px]">{item.name}</h4>
              {item.link && (
                <span className="text-[10px] text-slate-400 font-medium font-mono">
                  {item.link}
                </span>
              )}
            </div>
            <RichTextBlock value={item.description} className="m-0 mt-1.5 text-[11.5px] text-slate-600 leading-relaxed" />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const skillsEl = skills.length > 0 ? (
    <section className="mb-8">
      <SectionHeading>Skills</SectionHeading>
      <ul className="list-none p-0 m-0">
        {skills.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="light" />
        ))}
      </ul>
    </section>
  ) : null;

  const languagesEl = languages.length > 0 ? (
    <section className="mb-8">
      <SectionHeading>Languages</SectionHeading>
      <ul className="list-none p-0 m-0">
        {languages.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="light" />
        ))}
      </ul>
    </section>
  ) : null;

  const educationEl = education.length > 0 ? (
    <section className="mb-8">
      <SectionHeading>Education</SectionHeading>
      <div className="flex flex-col gap-5">
        {education.map((item, index) => (
          <div key={`${item.school}-${index}`} className="text-[11.5px]">
            <p className="m-0 font-bold text-slate-950 leading-snug">{item.degree}</p>
            <p className="m-0 text-[11px] text-slate-500 mt-0.5">{item.school}</p>
            <p className="m-0 text-[10px] text-slate-400 font-semibold mt-1">
              {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
            </p>
            <RichTextBlock value={item.description} className="m-0 mt-1.5 text-[11px] text-slate-500 leading-normal" />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const certificationsEl = certifications.length > 0 ? (
    <section>
      <SectionHeading>Certifications</SectionHeading>
      <div className="flex flex-col gap-4">
        {certifications.map((item, index) => (
          <div key={`${item.name}-${index}`} className="text-[11.5px]">
            <p className="m-0 font-bold text-slate-900 leading-snug">{item.name}</p>
            <p className="m-0 text-[10px] text-slate-400 font-semibold mt-0.5">
              {[item.issuer, item.date].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="flex flex-col flex-1 font-sans text-[12.5px] leading-relaxed text-slate-600 min-h-full bg-white">
      <header className="px-10 pt-10 pb-8 border-b border-slate-100 relative">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: "var(--resume-accent, #059669)" }}
        />
        
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="m-0 text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {personal.name || "Your Name"}
            </h1>
            {personal.headline && (
              <p
                className="mt-2.5 m-0 text-xs font-extrabold uppercase tracking-[0.15em]"
                style={{ color: "var(--resume-accent, #059669)" }}
              >
                {personal.headline}
              </p>
            )}
            
            {contacts.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {contacts.map((c, i) => (
                  <span key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="opacity-60 text-slate-400 font-bold">{c.icon}</span>
                    <span className="font-medium">{c.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {personal.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-slate-50">
              <img src={personal.image} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_220px] flex-1">
        <main className="px-10 py-8 border-r border-slate-100">
          {finalOrder.map((key) => {
            if (key === "summary") return <React.Fragment key={key}>{summaryEl}</React.Fragment>;
            if (key === "experience") return <React.Fragment key={key}>{experienceEl}</React.Fragment>;
            if (key === "extras") return <React.Fragment key={key}>{projectsEl}</React.Fragment>;
            return null;
          })}
        </main>

        <aside className="px-6 py-8 bg-slate-50/50">
          {finalOrder.map((key) => {
            if (key === "skills-languages") return (
              <React.Fragment key={key}>
                {skillsEl}
                {languagesEl}
              </React.Fragment>
            );
            if (key === "education") return <React.Fragment key={key}>{educationEl}</React.Fragment>;
            if (key === "extras") return <React.Fragment key={key}>{certificationsEl}</React.Fragment>;
            return null;
          })}
        </aside>
      </div>
    </div>
  );
}
