import React from "react";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";
import type { ResumeData } from "@/lib/resume-types";

type Props = {
  data: ResumeData;
};

function Divider() {
  return <div className="my-5 border-t border-slate-100" />;
}

export function MinimalTemplate({ data }: Props) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const finalOrder = Array.isArray(data.sectionsOrder) && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const summaryEl = data.summary ? (
    <section className="mt-8">
      <RichTextBlock
        value={data.summary}
        className="m-0 text-center text-slate-500 italic text-[12.5px] leading-relaxed max-w-xl mx-auto"
      />
    </section>
  ) : null;

  const expEl = data.experience.length > 0 ? (
    <section className="mb-8">
      <h3
        className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Experience
      </h3>
      <div className="grid gap-5">
        {data.experience.map((item, index) => (
          <div key={`${item.company}-${index}`}>
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="m-0 text-[13px] font-bold text-slate-900">{item.role}</h4>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className="m-0 mt-0.5 text-[11px] text-slate-500 font-medium">{item.company}</p>
            <DescriptionList value={item.description} />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const projectsEl = data.projects.length > 0 ? (
    <section>
      <h3
        className="m-0 mb-4 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Projects
      </h3>
      <div className="grid gap-4">
        {data.projects.map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <h4 className="m-0 text-[13px] font-bold text-slate-900">{item.name}</h4>
            {item.link && <p className="m-0 text-[11px] text-slate-400">{item.link}</p>}
            <RichTextBlock value={item.description} className="m-0 mt-1 text-[12px] text-slate-600" />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const skillsEl = data.skills.length > 0 ? (
    <section className="mb-7">
      <h3
        className="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Skills
      </h3>
      <ul className="list-none p-0 m-0">
        {data.skills.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} />
        ))}
      </ul>
    </section>
  ) : null;

  const langEl = data.languages.length > 0 ? (
    <section className="mb-7">
      <h3
        className="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Languages
      </h3>
      <ul className="list-none p-0 m-0">
        {data.languages.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} />
        ))}
      </ul>
    </section>
  ) : null;

  const eduEl = data.education.length > 0 ? (
    <section className="mb-7">
      <h3
        className="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Education
      </h3>
      <div className="grid gap-3">
        {data.education.map((item, index) => (
          <div key={`${item.school}-${index}`}>
            <p className="m-0 text-[12px] font-bold text-slate-900 leading-snug">{item.degree}</p>
            <p className="m-0 text-[11px] text-slate-500">{item.school}</p>
            <p className="m-0 text-[10px] text-slate-400">
              {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const certEl = data.certifications.length > 0 ? (
    <section>
      <h3
        className="m-0 mb-3 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #2563eb)" }}
      >
        Certifications
      </h3>
      <div className="grid gap-2">
        {data.certifications.map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <p className="m-0 text-[11px] font-bold text-slate-800 leading-snug">{item.name}</p>
            <p className="m-0 text-[10px] text-slate-400">
              {[item.issuer, item.date].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="flex flex-col flex-1 font-sans text-[13px] leading-relaxed text-slate-700 bg-white min-h-full">
      <header className="text-center px-16 pt-12 pb-8 border-b-2 border-slate-900">
        {data.personal.image && (
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200">
              <img src={data.personal.image} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <h2 className="m-0 text-[32px] font-light tracking-[0.12em] text-slate-900 uppercase">
          {data.personal.name || "Your Name"}
        </h2>
        <p
          className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--resume-accent, #2563eb)" }}
        >
          {data.personal.headline || "Professional Headline"}
        </p>
        {contacts.length > 0 && (
          <div className="mt-3 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            {contacts.map((c, i) => (
              <span key={c} className="flex items-center gap-4">
                {i > 0 && <span className="text-slate-300">·</span>}
                {c}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="px-16 pb-12">
        {summaryEl}
        <Divider />
        <div className="grid grid-cols-[1fr_200px] gap-10">
          <div>
            {finalOrder.map((key) => {
              if (key === "experience") return <React.Fragment key={key}>{expEl}</React.Fragment>;
              if (key === "extras") return <React.Fragment key={key}>{projectsEl}</React.Fragment>;
              return null;
            })}
          </div>
          <div>
            {finalOrder.map((key) => {
              if (key === "skills-languages") return (
                <React.Fragment key={key}>
                  {skillsEl}
                  {langEl}
                </React.Fragment>
              );
              if (key === "education") return <React.Fragment key={key}>{eduEl}</React.Fragment>;
              if (key === "extras") return <React.Fragment key={key}>{certEl}</React.Fragment>;
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
