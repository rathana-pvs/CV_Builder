import React from "react";
import { DescriptionList, SkillTag } from "../shared";
import type { ResumeData } from "@/lib/resume-types";

type Props = {
  data: ResumeData;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="inline-block w-1 h-5 rounded-full flex-shrink-0"
        style={{ background: "var(--resume-accent, #2563eb)" }}
      />
      <h3 className="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
        {children}
      </h3>
    </div>
  );
}

function SideTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="m-0 mb-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 border-b border-white/10 pb-2">
      {children}
    </h3>
  );
}

export function ModernTemplate({ data }: Props) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
  ].filter(Boolean);

  const finalOrder = data.sectionsOrder?.length
    ? data.sectionsOrder
    : ["personal", "summary", "experience", "education", "skills-languages", "extras"];

  // Predefine Components for cleaner map iteration
  const contactBlock = contacts.length > 0 && (
    <div className="mb-7" key="contact">
      <SideTitle>Contact</SideTitle>
      <div className="grid gap-1.5">
        {contacts.map((c) => (
          <span key={c} className="text-[11px] text-white/80 break-all">
            {c}
          </span>
        ))}
      </div>
    </div>
  );

  const skillsLanguagesBlock = (
    <React.Fragment key="skills-lang">
      {data.skills.length > 0 && (
        <div className="mb-7">
          <SideTitle>Skills</SideTitle>
          <ul className="list-none p-0 m-0">
            {data.skills.map((item) => (
              <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="dark" />
            ))}
          </ul>
        </div>
      )}
      {data.languages.length > 0 && (
        <div className="mb-7">
          <SideTitle>Languages</SideTitle>
          <ul className="list-none p-0 m-0">
            {data.languages.map((item) => (
              <SkillTag key={item} skill={item} style={data.skillLevelStyle} variant="dark" />
            ))}
          </ul>
        </div>
      )}
    </React.Fragment>
  );

  const certificationsBlock = data.certifications.length > 0 && (
    <div key="certifications">
      <SideTitle>Certifications</SideTitle>
      <div className="grid gap-3">
        {data.certifications.map((item, i) => (
          <div key={`${item.name}-${i}`}>
            <p className="m-0 text-[11px] font-bold text-white leading-snug">{item.name}</p>
            <p className="m-0 text-[10px] text-white/60 mt-0.5">
              {[item.issuer, item.date].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const summaryBlock = data.summary && (
    <section className="mb-7" key="summary">
      <SectionTitle>Profile</SectionTitle>
      <p className="m-0 text-slate-600 text-[13px]">{data.summary}</p>
    </section>
  );

  const experienceBlock = data.experience.length > 0 && (
    <section className="mb-7" key="experience">
      <SectionTitle>Experience</SectionTitle>
      <div className="grid gap-5">
        {data.experience.map((item, index) => (
          <div key={`${item.company}-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.role}</h4>
                <p className="m-0 mt-0.5 text-[11px] font-semibold" style={{ color: "var(--resume-accent, #2563eb)" }}>
                  {item.company}
                </p>
              </div>
              {(item.startDate || item.endDate) && (
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </span>
              )}
            </div>
            <DescriptionList value={item.description} />
          </div>
        ))}
      </div>
    </section>
  );

  const educationBlock = data.education.length > 0 && (
    <section className="mb-7" key="education">
      <SectionTitle>Education</SectionTitle>
      <div className="grid gap-4">
        {data.education.map((item, index) => (
          <div key={`${item.school}-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.degree}</h4>
                <p className="m-0 mt-0.5 text-[11px] font-semibold text-slate-500">{item.school}</p>
              </div>
              {(item.startDate || item.endDate) && (
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </span>
              )}
            </div>
            {item.description && <p className="m-0 mt-1 text-[12px] text-slate-600">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  const projectsBlock = data.projects.length > 0 && (
    <section key="projects">
      <SectionTitle>Projects</SectionTitle>
      <div className="grid gap-4">
        {data.projects.map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <div className="flex items-start gap-2">
              <h4 className="m-0 font-bold text-slate-900 text-[13px]">{item.name}</h4>
              {item.link && (
                <span className="text-[10px] text-slate-400 mt-0.5">{item.link}</span>
              )}
            </div>
            {item.description && <p className="m-0 mt-1 text-[12px] text-slate-600">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex flex-1 min-h-full font-sans text-[13px] leading-relaxed text-slate-700">
      {/* Sidebar */}
      <aside
        className="w-[220px] flex-shrink-0 px-6 py-10 text-white"
        style={{ background: "var(--resume-accent, #2563eb)" }}
      >
        {/* Static Header: Photo & Name */}
        {data.personal.image && (
          <div className="mb-5 w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
            <img src={data.personal.image} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mb-8">
          <h2 className="m-0 text-xl font-black leading-tight text-white">
            {data.personal.name || "Your Name"}
          </h2>
          <p className="mt-1.5 text-xs font-semibold text-white/70 leading-snug">
            {data.personal.headline || "Professional Headline"}
          </p>
        </div>

        {/* Dynamic Ordered Content for Aside */}
        {finalOrder.map((key) => {
          if (key === "personal") return contactBlock;
          if (key === "skills-languages") return skillsLanguagesBlock;
          if (key === "extras") return certificationsBlock;
          return null;
        })}
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-10">
        {finalOrder.map((key) => {
          if (key === "summary") return summaryBlock;
          if (key === "experience") return experienceBlock;
          if (key === "education") return educationBlock;
          if (key === "extras") return projectsBlock;
          return null;
        })}
      </main>
    </div>
  );
}
