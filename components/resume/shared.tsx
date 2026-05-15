import type { ReactNode } from "react";
import { renderRichTextBlock, renderRichTextDescription } from "@/lib/rich-text";

export function DescriptionList({ value }: { value?: string | null }) {
  const html = renderRichTextDescription(value);
  if (!html) return null;

  return (
    <div
      className="rich-text-content mt-2 text-[12px] text-slate-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function RichTextBlock({ value, className = "" }: { value?: string | null; className?: string }) {
  const html = renderRichTextBlock(value);
  if (!html) return null;

  return <div className={`rich-text-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-950">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function parseSkill(skill: string) {
  const match = skill.match(/^(.+?)(?:\s*[\(:-]\s*(.+?)\s*\)?\s*)$/);
  if (match) {
    const name = match[1].trim();
    const level = match[2].trim().replace(/\)$/, "");
    return { name, level };
  }
  return { name: skill, level: null };
}

export function SkillTag({
  skill,
  style = "line",
  variant = "light",
}: {
  skill: string;
  style?: "line" | "stars" | "none";
  variant?: "light" | "dark";
}) {
  const { name, level } = parseSkill(skill);
  const isDark = variant === "dark";

  if (!level || style === "none") {
    return (
      <li
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-block mb-1 mr-1 ${
          isDark
            ? "bg-white/15 text-white"
            : "border border-blue-100 bg-blue-50/10 text-slate-700"
        }`}
      >
        {name}
      </li>
    );
  }

  // Map levels to percentage & star counts
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

  return (
    <li
      className={`flex items-center justify-between text-[11px] font-medium py-1 w-full ${
        isDark
          ? "border-b border-white/10 last:border-0 text-white"
          : "border-b border-slate-100/50 last:border-0 text-slate-700"
      }`}
    >
      <span className={`font-semibold truncate block pr-3 ${isDark ? "text-white" : "text-slate-800"}`}>
        {name}
      </span>
      {style === "line" && (
        <div
          className={`w-[80px] h-1.5 rounded-full overflow-hidden flex-shrink-0 ${
            isDark ? "bg-white/20" : "bg-slate-100"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isDark ? "bg-white" : "bg-[var(--resume-accent,#2563eb)]"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {style === "stars" && (
        <div className="flex gap-0.5 text-[10px] items-center justify-end flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={
                s <= stars
                  ? isDark
                    ? "text-white font-bold"
                    : "text-amber-400 font-bold"
                  : isDark
                  ? "text-white/20"
                  : "text-slate-200"
              }
            >
              ★
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
