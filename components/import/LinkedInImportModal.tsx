"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Typography, message } from "antd";
import { LinkedinFilled, ImportOutlined, FilePdfOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LinkedInImportModal({ open, onClose }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleImport() {
    if (!file) {
      message.error("Upload your LinkedIn PDF first.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/import/linkedin", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const data = await response.json();
      onClose();
      setFile(null);
      router.push(`/resumes/${data.id}`);
    } catch {
      message.error("Could not import that LinkedIn PDF.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => !submitting && onClose()}
      width={640}
      centered
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a66c2] text-white">
            <LinkedinFilled />
          </div>
          <div>
            <p className="m-0 text-sm font-semibold text-slate-900">Import from LinkedIn</p>
            <p className="m-0 mt-1 text-xs font-normal text-slate-500">
              Upload a LinkedIn PDF to create a resume draft
            </p>
          </div>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose} disabled={submitting} className="rounded-md">
          Cancel
        </Button>,
        <Button
          key="import"
          type="primary"
          icon={<ImportOutlined />}
          loading={submitting}
          onClick={handleImport}
          className="rounded-md border-none bg-slate-900 font-semibold hover:bg-slate-800"
        >
          Import Draft
        </Button>,
      ]}
    >
      <div className="pt-2">
        <Typography.Paragraph className="mb-4 text-sm leading-6 text-slate-600">
          Export your LinkedIn profile as a PDF, upload it here, and the app will create a draft resume for you to review and edit.
        </Typography.Paragraph>
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Best results</p>
          <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
            Use the standard LinkedIn profile PDF export. After import, review the draft and clean up any fields that were formatted differently in the PDF.
          </p>
        </div>
        <div
          className={`relative block cursor-pointer rounded-xl border border-dashed p-6 text-center transition-all ${
            file 
              ? "border-emerald-500 bg-emerald-50/50" 
              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            disabled={submitting}
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                file ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {file ? <CheckCircleFilled className="text-xl" /> : <FilePdfOutlined className="text-xl" />}
            </div>
            <div className="w-full max-w-xs mx-auto truncate">
              <p className={`m-0 text-sm font-semibold transition-colors ${file ? "text-emerald-900" : "text-slate-900"}`}>
                {file ? file.name : "Choose LinkedIn PDF"}
              </p>
              <p className={`m-0 mt-1 text-xs transition-colors ${file ? "text-emerald-600" : "text-slate-500"}`}>
                {file ? `${(file.size / 1024).toFixed(1)} KB • Ready to import` : "Click to upload a PDF exported from LinkedIn"}
              </p>
            </div>
          </div>
          {file && !submitting && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFile(null);
              }}
              className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Remove file"
            >
              <CloseCircleFilled className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
