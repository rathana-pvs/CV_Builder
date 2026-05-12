import React from "react";
import { Typography, FormInstance } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";
import { ResumeData, TemplateId } from "@/lib/resume-types";

interface TemplateTabProps {
  data: ResumeData;
  template: TemplateId;
  form: FormInstance;
  syncPreview: () => void;
}

export function TemplateTab({ data, template, form, syncPreview }: TemplateTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex w-full flex-col gap-6 duration-300">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <Typography.Text className="block text-sm font-semibold text-slate-900">
            Accent Color
          </Typography.Text>
          <Typography.Text className="text-xs text-slate-500">
            Apply a consistent color across the resume template.
          </Typography.Text>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { name: "Default", hex: "" },
            { name: "Blue", hex: "#2563eb" },
            { name: "Teal", hex: "#0d9488" },
            { name: "Emerald", hex: "#059669" },
            { name: "Indigo", hex: "#4f46e5" },
            { name: "Violet", hex: "#7c3aed" },
            { name: "Rose", hex: "#e11d48" },
            { name: "Amber", hex: "#d97706" },
          ].map((preset) => {
            const isPresetSelected = (data.color || "") === preset.hex;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  form.setFieldsValue({ color: preset.hex });
                  syncPreview();
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  isPresetSelected
                    ? "scale-105 border-slate-900 shadow-sm ring-4 ring-slate-100"
                    : "border-transparent hover:scale-105 hover:border-slate-200"
                }`}
                style={{
                  backgroundColor: preset.hex ? preset.hex : "#f8fafc",
                  backgroundImage: !preset.hex ? "conic-gradient(from 180deg at 50% 50%, red, yellow, green, cyan, blue, magenta, red)" : "none"
                }}
                title={preset.name}
              >
                {isPresetSelected && <CheckOutlined className="text-white text-[10px] font-black drop-shadow-sm" />}
              </button>
            );
          })}
          <div className="mx-1 h-6 w-px bg-slate-200"></div>
          <input
            type="color"
            value={data.color || "#2563eb"}
            onChange={(e) => {
              form.setFieldsValue({ color: e.target.value });
              syncPreview();
            }}
            className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-transparent p-0 shadow-sm"
            title="Custom Color"
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <Typography.Text className="block text-sm font-semibold text-slate-900">
            Template
          </Typography.Text>
          <Typography.Text className="text-xs text-slate-500">
            Choose the document structure that best fits the role.
          </Typography.Text>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(TEMPLATES).map((tmpl) => {
            const isSelected = template === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  form.setFieldsValue({ template: tmpl.id });
                  syncPreview();
                }}
                className="group flex cursor-pointer flex-col gap-2 transition-all"
              >
                <div className={`relative flex aspect-[3/4.2] flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 ${isSelected ? "border-slate-900 shadow-sm ring-2 ring-slate-200" : "border-slate-200 group-hover:border-slate-300"}`}>
                  <div className="flex flex-1 flex-col gap-2 overflow-hidden bg-slate-50 p-3">
                    <div className="flex gap-2 items-center border-b border-slate-200/50 pb-1.5">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected ? (data.color || tmpl.accentColor) : tmpl.accentColor }} />
                      <div className="h-1.5 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-1 bg-slate-200 rounded w-full opacity-50"></div>
                    <div className="h-1 bg-slate-200 rounded w-full opacity-50"></div>
                    <div className="mt-1 h-1 bg-slate-200 rounded w-1/3"></div>
                    <div className="flex gap-2">
                      <div className="w-1/3 h-12 bg-slate-200/30 rounded"></div>
                      <div className="w-2/3 flex flex-col gap-1.5">
                        <div className="h-1 bg-slate-200 rounded w-full"></div>
                        <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-1 bg-slate-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                        <CheckOutlined className="text-sm" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <Typography.Text className={`block text-[13px] font-semibold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                    {tmpl.name}
                  </Typography.Text>
                  <Typography.Text className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                    {tmpl.id === "sea" ? "Premium Layout" : tmpl.id === "minimal" ? "Clean Minimal" : "Professional"}
                  </Typography.Text>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
