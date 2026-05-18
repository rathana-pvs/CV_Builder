import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { TEMPLATES } from "./TemplateRegistry";

type Props = {
  data: ResumeData;
  template: TemplateId;
  noShadow?: boolean;
};

export function ResumeTemplate({ data, template, noShadow }: Props) {
  const activeTemplate = TEMPLATES[template] || TEMPLATES.modern;
  const SelectedTemplate = activeTemplate.component;

  const style = data.color
    ? ({ "--resume-accent": data.color } as React.CSSProperties)
    : undefined;

  // Sanitize data to ensure all mapped arrays are safe from undefined/null items
  const sanitizedData: ResumeData = {
    ...data,
    experience: (data.experience || []).filter(Boolean),
    education: (data.education || []).filter(Boolean),
    skills: (data.skills || []).filter(Boolean),
    languages: (data.languages || []).filter(Boolean),
    projects: (data.projects || []).filter(Boolean),
    certifications: (data.certifications || []).filter(Boolean),
  };

  return (
    <article
      className={`resume-page template-${template} bg-white text-slate-800 ${noShadow ? "" : "shadow-2xl"}`}
      style={style}
    >
      <SelectedTemplate data={sanitizedData} />
    </article>
  );
}
