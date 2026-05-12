import React from "react";
import { Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { ResumeData, TemplateId } from "@/lib/resume-types";

interface PreviewPanelProps {
  previewData: ResumeData;
  template: TemplateId;
}

export function PreviewPanel({ previewData, template }: PreviewPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-slate-100/80 p-5 md:p-7 max-xl:h-auto">
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-4 pb-10">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-500 backdrop-blur">
          <div className="min-w-0">
            <Typography.Text
              type="secondary"
              className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              <EyeOutlined className="text-slate-400" /> Preview
            </Typography.Text>
            <Typography.Text className="mt-1 block text-[12px] text-slate-600">
              Live A4 document rendering
            </Typography.Text>
          </div>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            100%
          </span>
        </div>
        <div className="w-full max-w-[794px] self-center overflow-hidden rounded-lg border border-slate-300/80 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.08)] transition-all duration-500">
          <ResumeTemplate data={previewData} template={template} />
        </div>
      </div>
    </div>
  );
}
