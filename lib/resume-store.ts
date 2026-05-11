"use client";

import { create } from "zustand";
import type { ResumeData, TemplateId } from "@/lib/resume-types";

type ResumeEditorState = {
  title: string;
  slug: string;
  template: TemplateId;
  data: ResumeData;
  isPublic: boolean;
  setMeta: (values: Partial<Omit<ResumeEditorState, "data" | "setMeta" | "setData">>) => void;
  setData: (data: ResumeData) => void;
};

export const useResumeStore = create<ResumeEditorState>((set) => ({
  title: "",
  slug: "",
  template: "modern",
  data: {
    personal: { name: "", headline: "", email: "", phone: "", location: "", website: "" },
    summary: "",
    skills: [],
    languages: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  },
  isPublic: false,
  setMeta: (values) => set(values),
  setData: (data) => set({ data }),
}));
