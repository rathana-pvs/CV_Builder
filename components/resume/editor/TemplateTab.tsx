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
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <Typography.Text className="font-bold text-sm text-slate-800 block mb-4">
          Main Accent Color
        </Typography.Text>
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
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
                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                  isPresetSelected
                    ? "border-blue-500 scale-110 shadow-md ring-4 ring-blue-50"
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
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <input
            type="color"
            value={data.color || "#2563eb"}
            onChange={(e) => {
              form.setFieldsValue({ color: e.target.value });
              syncPreview();
            }}
            className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer overflow-hidden p-0 bg-transparent flex-shrink-0 shadow-sm"
            title="Custom Color"
          />
        </div>
      </div>

      <div>
        <Typography.Text className="font-bold text-sm text-slate-800 block mb-4">
          Choose Template
        </Typography.Text>
        <div className="grid grid-cols-2 gap-5">
          {Object.values(TEMPLATES).map((tmpl) => {
            const isSelected = template === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  form.setFieldsValue({ template: tmpl.id });
                  syncPreview();
                }}
                className="group cursor-pointer flex flex-col gap-2.5 transition-all"
              >
                <div className={`relative aspect-[3/4.2] bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${isSelected ? 'border-blue-500 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 group-hover:border-slate-300 group-hover:shadow-sm'}`}>
                  <div className="flex-1 bg-slate-50 p-3 flex flex-col gap-2 overflow-hidden">
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
                    <div className="absolute inset-0 bg-blue-600/5 flex items-center justify-center">
                      <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transform scale-110 animate-in zoom-in duration-200">
                        <CheckOutlined className="text-sm" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center px-1">
                  <Typography.Text className={`font-extrabold text-[13px] block ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                    {tmpl.name}
                  </Typography.Text>
                  <Typography.Text className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {tmpl.id === "sea" ? "Premium Layout" : tmpl.id === "minimal" ? "Clean Minimal" : "Professional"}
                  </Typography.Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
