import type { ResumeData } from "@/lib/resume-types";

export const sampleResumeData: ResumeData = {
  personal: {
    name: "Sok Dara",
    headline: "Frontend Developer",
    email: "dara@example.com",
    phone: "+855 12 345 678",
    location: "Phnom Penh, Cambodia",
    website: "linkedin.com/in/sokdara",
  },
  summary:
    "Frontend developer with experience building responsive web applications, improving user workflows, and collaborating with design and product teams.",
  skills: ["JavaScript", "React", "Next.js", "TypeScript", "HTML", "CSS", "Accessibility", "SQL"],
  languages: ["Khmer - Native", "English - Professional"],
  experience: [
    {
      role: "Frontend Developer",
      company: "Bright Digital",
      startDate: "2023",
      endDate: "Present",
      description:
        "Built reusable dashboard components for customer support teams.\nImproved mobile page performance and reduced layout issues.\nWorked with designers to deliver accessible user interfaces.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      school: "Royal University of Phnom Penh",
      startDate: "2019",
      endDate: "2023",
      description: "Coursework in software engineering, databases, and web development.",
    },
  ],
  projects: [
    {
      name: "Candidate Tracking Dashboard",
      link: "github.com/sokdara/candidate-dashboard",
      description: "Built a responsive dashboard with search, filters, and reusable table components.",
    },
  ],
  certifications: [
    {
      name: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "2024",
    },
  ],
};
