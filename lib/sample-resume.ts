import type { ResumeData } from "@/lib/resume-types";

export const emptyResumeData: ResumeData = {
  personal: {
    name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  },
  summary: "",
  skills: [],
  languages: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

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
    "Dynamic and detail-oriented Software Developer with over 6 years of experience in full-stack web development and systems architecture. Proven expertise in building scalable database management tools and high-performance web applications. Adept at migrating legacy systems to modern stacks and optimizing automated workflows in Linux-based environments.",
  skills: ["JavaScript", "React", "Next.js", "TypeScript", "HTML", "CSS", "Accessibility", "SQL"],
  languages: ["Khmer", "English"],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Zenith AI Labs",
      startDate: "Jan 2024",
      endDate: "Present",
      description:
        "Architected Lumina Architect, an AI-driven development suite that automates boilerplate generation, increasing team velocity by 30%.\nLead the migration of internal database tools to a modern React/NestJS architecture, focusing on modular UI components.\nMentor junior developers on clean code practices and efficient state management using TypeScript.",
    },
    {
      role: "Software Engineer",
      company: "Veridian Fintech Systems",
      startDate: "Jun 2021",
      endDate: "Feb 2023",
      description:
        "Developed CoreFlow 2.0, a high-frequency transaction processing engine handling thousands of concurrent data requests.\nIntegrated advanced data visualization charts for financial monitoring dashboards using React and D3.js.\nStreamlined deployment pipelines using Docker, reducing environment setup time for new developers by 50%.",
    },
    {
      role: "Junior Full-Stack Developer",
      company: "NexusStream Solutions",
      startDate: "Jan 2020",
      endDate: "May 2021",
      description:
        "Contributed to Project Orion, a cross-platform resource tracking application.\nImplemented responsive frontend interfaces using Ant Design and optimized CSS for mobile-first performance.\nManaged SQL database schema updates and wrote complex queries to improve report generation speed.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "Royal University of Phnom Penh",
      startDate: "Jan 2015",
      endDate: "Dec 2019",
      description: "Data Structures & Algorithms, Database Systems, Web Application Development, Operating Systems.",
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
