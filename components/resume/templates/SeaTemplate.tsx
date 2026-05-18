import React from "react";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";
import type { ResumeData } from "@/lib/resume-types";

type Props = {
  data: ResumeData;
};

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/50 border-b border-white/10 pb-1.5">
        {title}
      </h3>
      {children}
    </section>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {title}
        </h3>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      {children}
    </section>
  );
}

export function SeaTemplate({ data }: Props) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const finalOrder = Array.isArray(data.sectionsOrder) && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const contactEl = contacts.length > 0 ? (
    <SideSection title="Contact">
      <div className="grid gap-1.5">
        {contacts.map((c) => (
          <span key={c} className="text-[10px] text-white/75 break-all leading-snug">
            {c}
          </span>
        ))}
      </div>
    </SideSection>
  ) : null;

  const skillsEl = data.skills.length > 0 ? (
    <SideSection title="Skills">
      <ul className="list-none p-0 m-0">
        {data.skills.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="dark" />
        ))}
      </ul>
    </SideSection>
  ) : null;

  const languagesEl = data.languages.length > 0 ? (
    <SideSection title="Languages">
      <ul className="list-none p-0 m-0">
        {data.languages.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="dark" />
        ))}
      </ul>
    </SideSection>
  ) : null;

  const certificationsEl = data.certifications.length > 0 ? (
    <SideSection title="Certifications">
      <div className="grid gap-2">
        {data.certifications.map((item, i) => (
          <div key={`${item.name}-${i}`}>
            <p className="m-0 text-[10px] font-bold text-white leading-snug">{item.name}</p>
            <p className="m-0 text-[9px] text-white/50 mt-0.5">
              {[item.issuer, item.date].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </SideSection>
  ) : null;

  const summaryEl = data.summary ? (
    <MainSection title="About">
      <RichTextBlock value={data.summary} className="m-0 text-slate-600 text-[12.5px] leading-relaxed" />
    </MainSection>
  ) : null;

  const experienceEl = data.experience.length > 0 ? (
    <MainSection title="Experience">
      <div className="grid gap-5">
        {data.experience.map((item, index) => (
          <div key={`${item.company}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center pt-1 flex-shrink-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--resume-accent, #0d9488)" }}
              />
              <div className="w-px flex-1 bg-slate-100 mt-1" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.role}</h4>
                  <p
                    className="m-0 mt-0.5 text-[11px] font-semibold"
                    style={{ color: "var(--resume-accent, #0d9488)" }}
                  >
                    {item.company}
                  </p>
                </div>
                {(item.startDate || item.endDate) && (
                  <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                    {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                  </span>
                )}
              </div>
              <DescriptionList value={item.description} />
            </div>
          </div>
        ))}
      </div>
    </MainSection>
  ) : null;

  const educationEl = data.education.length > 0 ? (
    <MainSection title="Education">
      <div className="grid gap-4">
        {data.education.map((item, index) => (
          <div key={`${item.school}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center pt-1 flex-shrink-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--resume-accent, #0d9488)" }}
              />
            </div>
            <div>
              <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.degree}</h4>
              <p className="m-0 mt-0.5 text-[11px] text-slate-500">{item.school}</p>
              <p className="m-0 text-[10px] text-slate-400">
                {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
              </p>
              <RichTextBlock value={item.description} className="m-0 mt-1 text-[12px] text-slate-600" />
            </div>
          </div>
        ))}
      </div>
    </MainSection>
  ) : null;

  const projectsEl = data.projects.length > 0 ? (
    <MainSection title="Projects">
      <div className="grid gap-4">
        {data.projects.map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <div className="flex items-center gap-2">
              <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.name}</h4>
              {item.link && (
                <span className="text-[10px] text-slate-400">{item.link}</span>
              )}
            </div>
            <RichTextBlock value={item.description} className="m-0 mt-1 text-[12px] text-slate-600" />
          </div>
        ))}
      </div>
    </MainSection>
  ) : null;

  return (
    <div className="flex flex-1 min-h-full font-sans text-[13px] leading-relaxed text-slate-700">
      <aside
        className="w-[205px] flex-shrink-0 px-5 py-9 flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(160deg, var(--resume-accent, #0d9488) 0%, color-mix(in srgb, var(--resume-accent, #0d9488) 70%, #000) 100%)",
          backgroundSize: "100% 1123px",
          backgroundRepeat: "repeat-y",
        }}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          {data.personal.image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 shadow-lg border border-white/20">
              <img src={data.personal.image} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-lg"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {(data.personal.name || "?")[0]?.toUpperCase()}
            </div>
          )}
          <h2 className="m-0 text-base font-black leading-tight text-white">
            {data.personal.name || "Your Name"}
          </h2>
          <p className="mt-1 text-[10px] font-semibold text-white/60 leading-snug">
            {data.personal.headline || "Professional Headline"}
          </p>
        </div>

        {finalOrder.map((key) => {
          if (key === "personal") return <React.Fragment key={key}>{contactEl}</React.Fragment>;
          if (key === "skills-languages") return (
            <React.Fragment key={key}>
              {skillsEl}
              {languagesEl}
            </React.Fragment>
          );
          if (key === "extras") return <React.Fragment key={key}>{certificationsEl}</React.Fragment>;
          return null;
        })}
      </aside>

      <main className="flex-1 px-8 py-9 bg-white">
        {finalOrder.map((key) => {
          if (key === "summary") return <React.Fragment key={key}>{summaryEl}</React.Fragment>;
          if (key === "experience") return <React.Fragment key={key}>{experienceEl}</React.Fragment>;
          if (key === "education") return <React.Fragment key={key}>{educationEl}</React.Fragment>;
          if (key === "extras") return <React.Fragment key={key}>{projectsEl}</React.Fragment>;
          return null;
        })}
      </main>
    </div>
  );
}
