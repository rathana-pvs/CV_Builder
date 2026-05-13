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
};

export const TEMPLATES: Record<TemplateId, TemplateMetadata> = {
  modern: {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    accentColor: "#2563eb",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    accentColor: "#2563eb",
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    component: CorporateTemplate,
    accentColor: "#2563eb",
  },
  sea: {
    id: "sea",
    name: "SEA Focus",
    component: SeaTemplate,
    accentColor: "#0f766e",
  },
  creative: {
    id: "creative",
    name: "Creative Timeline",
    component: CreativeTemplate,
    accentColor: "#1e293b",
  },
  classic: {
    id: "classic",
    name: "Classic Profile",
    component: ClassicTemplate,
    accentColor: "#17201f",
  },
  executive: {
    id: "executive",
    name: "Executive Blue",
    component: ExecutiveTemplate,
    accentColor: "#27456d",
  },
};
