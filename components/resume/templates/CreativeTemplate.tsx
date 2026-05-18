import React from "react";
import { DescriptionList, RichTextBlock, SkillTag } from "../shared";
import type { ResumeData } from "@/lib/resume-types";

type Props = {
  data: ResumeData;
};

/* ─── Small sub-components ──────────────────────────────────────────── */

function SideHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="m-0 mb-3 text-[8.5px] font-black uppercase tracking-[0.22em]"
      style={{ color: "var(--resume-accent, #1e293b)" }}
    >
      {children}
    </h3>
  );
}

function SideRule() {
  return (
    <div
      className="h-px w-6 mb-4"
      style={{ backgroundColor: "var(--resume-accent, #1e293b)", opacity: 0.25 }}
    />
  );
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <span className="text-[10px] mt-px flex-shrink-0 opacity-50">{icon}</span>
      <span className="text-[10.5px] text-slate-600 break-all leading-snug">{value}</span>
    </div>
  );
}

/** Vertical timeline entry wrapper for the main column */
function TimelineEntry({
  last = false,
  children,
}: {
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      {/* dot + line */}
      <div className="flex flex-col items-center flex-shrink-0 pt-[3px]">
        <div
          className="w-[7px] h-[7px] rounded-full flex-shrink-0 ring-2 ring-white"
          style={{
            backgroundColor: "var(--resume-accent, #1e293b)",
          }}
        />
        {!last && (
          <div
            className="w-px flex-1 mt-1 opacity-15"
            style={{ backgroundColor: "var(--resume-accent, #1e293b)" }}
          />
        )}
      </div>
      <div className="flex-1 pb-5">{children}</div>
    </div>
  );
}

function MainSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-1">
      <span
        className="text-[9px] font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--resume-accent, #1e293b)" }}
      >
        {children}
      </span>
      <div
        className="flex-1 h-px opacity-20"
        style={{ backgroundColor: "var(--resume-accent, #1e293b)" }}
      />
    </div>
  );
}

/* ─── Main template ──────────────────────────────────────────────────── */

export function CreativeTemplate({ data }: Props) {
  const { personal, summary, skills, languages, experience, education, projects, certifications } =
    data;

  const finalOrder = Array.isArray(data.sectionsOrder) && data.sectionsOrder.length > 0
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  const skillsEl = skills.length > 0 ? (
    <div className="mb-6">
      <SideHeading>Skills</SideHeading>
      <SideRule />
      <ul className="list-none p-0 m-0">
        {skills.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="light" />
        ))}
      </ul>
    </div>
  ) : null;

  const languagesEl = languages.length > 0 ? (
    <div className="mb-6">
      <SideHeading>Languages</SideHeading>
      <SideRule />
      <ul className="list-none p-0 m-0">
        {languages.map((item) => (
          <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="light" />
        ))}
      </ul>
    </div>
  ) : null;

  const certificationsEl = certifications.length > 0 ? (
    <div>
      <SideHeading>Certifications</SideHeading>
      <SideRule />
      <div className="grid gap-3">
        {certifications.map((item, i) => (
          <div key={`${item.name}-${i}`}>
            <p
              className="m-0 text-[10.5px] font-bold leading-snug"
              style={{ color: "var(--resume-accent, #1e293b)" }}
            >
              {item.name}
            </p>
            {(item.issuer || item.date) && (
              <p className="m-0 mt-0.5 text-[9.5px] text-slate-400">
                {[item.issuer, item.date].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const summaryEl = summary ? (
    <section className="mb-6">
      <MainSectionTitle>Profile</MainSectionTitle>
      <RichTextBlock value={summary} className="m-0 text-slate-600 text-[12px] leading-[1.7]" />
    </section>
  ) : null;

  const experienceEl = experience.length > 0 ? (
    <section className="mb-6">
      <MainSectionTitle>Employment History</MainSectionTitle>
      <div>
        {experience.map((item, idx) => (
          <TimelineEntry key={`${item.company}-${idx}`} last={idx === experience.length - 1}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h4 className="m-0 text-[12.5px] font-bold text-slate-900 leading-snug">
                  {item.role}
                </h4>
                <p
                  className="m-0 mt-0.5 text-[11px] font-semibold"
                  style={{ color: "var(--resume-accent, #1e293b)" }}
                >
                  {item.company}
                </p>
              </div>
              {(item.startDate || item.endDate) && (
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5 flex-shrink-0">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </span>
              )}
            </div>
            <DescriptionList value={item.description} />
          </TimelineEntry>
        ))}
      </div>
    </section>
  ) : null;

  const educationEl = education.length > 0 ? (
    <section className="mb-6">
      <MainSectionTitle>Education</MainSectionTitle>
      <div>
        {education.map((item, idx) => (
          <TimelineEntry key={`${item.school}-${idx}`} last={idx === education.length - 1}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h4 className="m-0 text-[12.5px] font-bold text-slate-900 leading-snug">
                  {item.degree}
                </h4>
                <p className="m-0 mt-0.5 text-[11px] text-slate-500 font-medium">
                  {item.school}
                </p>
              </div>
              {(item.startDate || item.endDate) && (
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5 flex-shrink-0">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </span>
              )}
            </div>
            <RichTextBlock value={item.description} className="m-0 mt-1 text-[11.5px] text-slate-600" />
          </TimelineEntry>
        ))}
      </div>
    </section>
  ) : null;

  const projectsEl = projects.length > 0 ? (
    <section>
      <MainSectionTitle>Projects</MainSectionTitle>
      <div className="grid gap-4">
        {projects.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="pl-4 border-l-2" style={{ borderColor: "var(--resume-accent, #1e293b)", opacity: 1 }}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h4 className="m-0 text-[12.5px] font-bold text-slate-900">{item.name}</h4>
              {item.link && (
                <span className="text-[10px] text-slate-400">{item.link}</span>
              )}
            </div>
            <RichTextBlock value={item.description} className="m-0 mt-1 text-[11.5px] text-slate-600 leading-relaxed" />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="flex flex-col flex-1 min-h-full font-sans text-slate-700 text-[12.5px] leading-relaxed bg-white">

      <header className="relative overflow-hidden px-10 pt-9 pb-7 flex items-center gap-6">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, var(--resume-accent, #1e293b) 0%, color-mix(in srgb, var(--resume-accent, #1e293b) 82%, #000) 100%)",
          }}
        />
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-[0.07]"
          style={{ backgroundColor: "#fff" }}
        />
        <div
          className="absolute right-24 -bottom-8 w-28 h-28 rounded-full opacity-[0.05]"
          style={{ backgroundColor: "#fff" }}
        />

        <div className="relative z-10 flex-shrink-0">
          {personal.image ? (
            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white/25 shadow-lg">
              <img src={personal.image} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-[72px] h-[72px] rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-lg border border-white/15"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              {(personal.name || "?")[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="relative z-10 flex-1">
          <h1 className="m-0 text-[22px] font-black text-white leading-tight tracking-tight">
            {personal.name || "Your Name"}
          </h1>
          {personal.headline && (
            <p className="m-0 mt-1 text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em]">
              {personal.headline}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {personal.email && (
              <span className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="opacity-60">✉</span> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="opacity-60">✆</span> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="opacity-60">⌖</span> {personal.location}
              </span>
            )}
            {personal.website && (
              <span className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="opacity-60">⊕</span> {personal.website}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-[190px] flex-shrink-0 px-6 py-7 border-r border-slate-100 bg-slate-50/60">
          {finalOrder.map((key) => {
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

        <main className="flex-1 px-8 py-7 overflow-hidden">
          {finalOrder.map((key) => {
            if (key === "summary") return <React.Fragment key={key}>{summaryEl}</React.Fragment>;
            if (key === "experience") return <React.Fragment key={key}>{experienceEl}</React.Fragment>;
            if (key === "education") return <React.Fragment key={key}>{educationEl}</React.Fragment>;
            if (key === "extras") return <React.Fragment key={key}>{projectsEl}</React.Fragment>;
            return null;
          })}
        </main>
      </div>
    </div>
  );
}
