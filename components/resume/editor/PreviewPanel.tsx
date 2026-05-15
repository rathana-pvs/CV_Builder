import { Drawer, FormInstance, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";
import { ResumeData, TemplateId } from "@/lib/resume-types";
import { sampleResumeData } from "@/lib/sample-resume";

interface PreviewPanelProps {
  previewData: ResumeData;
  template: TemplateId;
  form: FormInstance;
  syncPreview: () => void;
}

const colorPresets = [
  { name: "Default", hex: "" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Emerald", hex: "#059669" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
];

export function PreviewPanel({ previewData, template, form, syncPreview }: PreviewPanelProps) {
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white max-xl:h-auto">
      <div className="border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography.Text className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Preview Style
            </Typography.Text>
            <Typography.Text className="block text-sm font-semibold text-slate-900">
              {TEMPLATES[template].name}
            </Typography.Text>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setTemplateDrawerOpen(true)}
              className="flex h-9 min-w-[220px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300"
            >
              <span className="truncate">{TEMPLATES[template].name}</span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Change</span>
            </button>

            <div className="flex items-center gap-1.5">
              {colorPresets.map((preset) => {
                const isSelected = (previewData.color || "") === preset.hex;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      form.setFieldsValue({ color: preset.hex });
                      syncPreview();
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "border-slate-900 ring-2 ring-slate-200"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                    style={{
                      backgroundColor: preset.hex || "#f8fafc",
                      backgroundImage: !preset.hex
                        ? "conic-gradient(from 180deg at 50% 50%, red, yellow, green, cyan, blue, magenta, red)"
                        : "none",
                    }}
                    title={preset.name}
                  >
                    {isSelected ? <CheckOutlined className="text-[9px] text-white drop-shadow-sm" /> : null}
                  </button>
                );
              })}
              <input
                type="color"
                value={previewData.color || "#2563eb"}
                onChange={(event) => {
                  form.setFieldsValue({ color: event.target.value });
                  syncPreview();
                }}
                className="h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-transparent p-0"
                title="Custom color"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-full overflow-y-auto px-2 py-4 md:px-3 md:py-5">
        <div className="mx-auto flex w-full max-w-[820px] justify-center pb-6">
          <div className="w-full max-w-[794px] overflow-hidden bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition-all duration-500">
            <ResumeTemplate data={previewData} template={template} />
          </div>
        </div>
      </div>

      <Drawer
        title={
          <div>
            <Typography.Text className="block text-base font-bold text-slate-900">
              Choose Template
            </Typography.Text>
            <Typography.Text className="text-xs text-slate-500">
              Browse document styles with full preview thumbnails.
            </Typography.Text>
          </div>
        }
        placement="right"
        width="min(760px, 92vw)"
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        className="[&_.ant-drawer-body]:!bg-slate-50 [&_.ant-drawer-body]:!p-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.values(TEMPLATES).map((tmpl) => {
            const isSelected = template === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  form.setFieldsValue({ template: tmpl.id });
                  syncPreview();
                  setTemplateDrawerOpen(false);
                }}
                className={`group overflow-hidden rounded-xl border bg-white text-left transition-all ${
                  isSelected
                    ? "border-slate-900 shadow-sm ring-2 ring-slate-200"
                    : "border-slate-200 hover:border-slate-400 hover:shadow-sm"
                }`}
              >
                <div className="relative aspect-[210/297] overflow-hidden bg-slate-100">
                  <div className="absolute left-1/2 top-1/2 h-[1123px] w-[794px] origin-center scale-[0.28] -translate-x-1/2 -translate-y-1/2">
                    <ResumeTemplate
                      data={{ ...sampleResumeData, color: previewData.color }}
                      template={tmpl.id}
                    />
                  </div>
                  {isSelected ? (
                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                      <CheckOutlined className="text-sm" />
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                  <div className="min-w-0">
                    <Typography.Text className="block truncate text-sm font-bold text-slate-900">
                      {tmpl.name}
                    </Typography.Text>
                    <Typography.Text className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {tmpl.id}
                    </Typography.Text>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-hover:text-slate-700">
                    Select
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}
