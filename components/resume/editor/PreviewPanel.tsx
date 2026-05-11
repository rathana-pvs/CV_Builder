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
    <div className="bg-slate-100 overflow-y-auto no-scrollbar h-full p-8 flex items-start justify-center max-xl:h-auto">
      <div className="flex flex-col items-center gap-5 w-full max-w-[850px] pb-12">
        <div className="flex items-center justify-between w-full px-2 text-slate-500">
          <Typography.Text
            type="secondary"
            className="font-bold text-[10px] uppercase tracking-wider flex items-center gap-2"
          >
            <EyeOutlined className="text-slate-400" /> Live Editor Preview
          </Typography.Text>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 tracking-wider">
            A4 Format (100%)
          </span>
        </div>
        <div className="w-full shadow-2xl shadow-slate-400/20 rounded-2xl overflow-hidden bg-white ring-[12px] ring-slate-200/30 max-w-[794px] transition-all duration-500">
          <ResumeTemplate data={previewData} template={template} />
        </div>
      </div>
    </div>
  );
}
