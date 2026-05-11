export type TemplateId = "modern" | "minimal" | "corporate" | "sea" | "creative";

export type ResumeData = {
  personal: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    image?: string;
  };
  summary: string;
  skills: string[];
  languages: string[];
  sectionsOrder?: string[];
  skillLevelStyle?: "line" | "stars" | "none";
  color?: string;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    link: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
};

export type ResumeRecord = {
  id: string;
  title: string;
  slug: string;
  template: TemplateId;
  dataJson: ResumeData;
  isPublic: boolean;
  updatedAt: string;
};
