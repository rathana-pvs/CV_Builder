import type { ComponentType } from "react";
import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CorporateTemplate } from "./templates/CorporateTemplate";
import { SeaTemplate } from "./templates/SeaTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

export type TemplateMetadata = {
  id: TemplateId;
  name: string;
  component: ComponentType<{ data: ResumeData }>;
  accentColor: string;
  description?: string;
  tag?: string;
};

export const TEMPLATES: Record<TemplateId, TemplateMetadata> = {
  modern: {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    accentColor: "#2563eb",
    description: "Balanced spacing and strong section hierarchy for most applications.",
    tag: "POPULAR",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    accentColor: "#2563eb",
    description: "Quiet typography with generous whitespace for focused reading.",
    tag: "CLEAN",
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    component: CorporateTemplate,
    accentColor: "#2563eb",
    description: "Formal structure tuned for management and business roles.",
    tag: "FORMAL",
  },
  sea: {
    id: "sea",
    name: "SEA Focus",
    component: SeaTemplate,
    accentColor: "#0f766e",
    description: "Standard layout optimized for Southeast Asian recruitment markets.",
    tag: "SEA",
  },
  creative: {
    id: "creative",
    name: "Creative Timeline",
    component: CreativeTemplate,
    accentColor: "#1e293b",
    description: "Dynamic timeline-based layout for designers and creatives.",
    tag: "PORTFOLIO",
  },
  classic: {
    id: "classic",
    name: "Classic Profile",
    component: ClassicTemplate,
    accentColor: "#17201f",
    description: "Traditional academic format with focus on text density.",
    tag: "NEW",
  },
  executive: {
    id: "executive",
    name: "Executive Blue",
    component: ExecutiveTemplate,
    accentColor: "#27456d",
    description: "Dense, professional layout for senior management roles.",
  },
};
