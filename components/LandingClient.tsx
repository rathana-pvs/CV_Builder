"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, message, Modal, Spin } from "antd";
import { 
  CopyOutlined,
  FileAddOutlined,
  RightOutlined, 
  FileDoneOutlined, 
  LayoutOutlined, 
  HighlightOutlined, 
  CheckCircleFilled,
  LoadingOutlined,
  LinkedinFilled,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import type { TemplateId } from "@/lib/resume-types";
import { sampleResumeData } from "@/lib/sample-resume";
import { LinkedInImportModal } from "@/components/import/LinkedInImportModal";
import { BrandLogo } from "@/components/brand/LogoMark";

const templateDescriptions: Record<TemplateId, string> = {
  modern: "Balanced spacing and strong section hierarchy for most applications.",
  minimal: "Quiet typography with generous whitespace for focused reading.",
  corporate: "Formal structure tuned for management and business roles.",
  sea: "A refined two-column layout with regional profile emphasis.",
  creative: "A timeline-led layout for portfolio and creative positions.",
  classic: "A polished A4 profile layout based on the uploaded reference design.",
  executive: "A navy two-column profile with sidebar details and timeline sections.",
};

const templateBadges: Record<TemplateId, string> = {
  modern: "Popular",
  minimal: "Clean",
  corporate: "Formal",
  sea: "SEA",
  creative: "Portfolio",
  classic: "New",
  executive: "Blue",
};

export function LandingClient() {
  const router = useRouter();
  const [loadingTemplate, setLoadingTemplate] = useState<TemplateId | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [creatingMode, setCreatingMode] = useState<"empty" | "sample" | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const activeTemplate = loadingTemplate ? TEMPLATES[loadingTemplate] : null;
  const selectedTemplateConfig = selectedTemplate ? TEMPLATES[selectedTemplate] : null;

  const openTemplateChoice = (templateId: TemplateId) => {
    if (loadingTemplate || creatingMode) return;
    setSelectedTemplate(templateId);
  };

  const createResume = async (templateId: TemplateId, dataMode: "empty" | "sample") => {
    if (loadingTemplate || creatingMode) return;
    setLoadingTemplate(templateId);
    setCreatingMode(dataMode);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateId, dataMode }),
      });

      if (!res.ok) throw new Error("Failed to create");

      const data = await res.json();
      router.push(`/resumes/${data.id}`);
    } catch (err) {
      message.error("Something went wrong creating your resume.");
      setLoadingTemplate(null);
      setCreatingMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <LinkedInImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <Modal
        open={Boolean(selectedTemplate)}
        title={
          <span className="text-lg font-black text-slate-900">
            Choose CV content
          </span>
        }
        footer={null}
        onCancel={() => {
          if (!creatingMode) setSelectedTemplate(null);
        }}
        centered
        width={560}
      >
        {selectedTemplateConfig ? (
          <div>
            <p className="m-0 pb-4 text-sm text-slate-500">
              Create a CV with the {selectedTemplateConfig.name} template.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileAddOutlined className="text-lg" />
                  </div>
                  <h3 className="m-0 text-base font-black text-slate-900">Empty CV</h3>
                  <p className="m-0 mt-2 text-sm leading-6 text-slate-500">
                    Start with blank fields and build the resume from scratch.
                  </p>
                </div>
                <div className="mt-auto pt-5">
                  <Button
                    block
                    onClick={() => createResume(selectedTemplateConfig.id, "empty")}
                    loading={creatingMode === "empty"}
                    disabled={creatingMode === "sample"}
                    className="h-10 rounded-lg font-bold"
                  >
                    Start empty
                  </Button>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-lg border border-blue-200 bg-blue-50/60 p-5 text-left shadow-sm">
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <CopyOutlined className="text-lg" />
                  </div>
                  <h3 className="m-0 text-base font-black text-slate-900">Sample Data</h3>
                  <p className="m-0 mt-2 text-sm leading-6 text-slate-500">
                    Use the software engineer sample as a realistic starting point.
                  </p>
                </div>
                <div className="mt-auto pt-5">
                  <Button
                    block
                    type="primary"
                    onClick={() => createResume(selectedTemplateConfig.id, "sample")}
                    loading={creatingMode === "sample"}
                    disabled={creatingMode === "empty"}
                    className="h-10 rounded-lg bg-blue-600 font-bold"
                  >
                    Use sample
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
      {activeTemplate ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/88 backdrop-blur-sm">
          <div className="mx-6 w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: activeTemplate.accentColor }}
              >
                <LayoutOutlined className="text-lg" />
              </div>
              <div>
                <p className="m-0 text-sm font-semibold text-slate-900">Preparing your resume</p>
                <p className="m-0 mt-1 text-xs text-slate-500">{activeTemplate.name} template</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <Spin indicator={<LoadingOutlined spin className="text-slate-700" />} />
              <div>
                <p className="m-0 text-sm font-medium text-slate-800">Creating workspace</p>
                <p className="m-0 mt-1 text-xs text-slate-500">This can take a moment on first load.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            disabled={Boolean(loadingTemplate)}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <BrandLogo
              markClassName="h-9 w-9 drop-shadow-sm"
              subtitle="Professional resume studio"
              title="ResumeDot"
            />
          </button>
          <div className="flex items-center gap-2">
            <Button
              type="text"
              className="font-semibold text-slate-600"
              disabled={Boolean(loadingTemplate)}
              onClick={() => router.push("/login")}
            >
              Sign in
            </Button>
            <Button
              type="primary"
              className="rounded-lg border-none bg-slate-950 px-4 font-bold shadow-sm hover:!bg-slate-800"
              disabled={Boolean(loadingTemplate)}
              onClick={() => router.push("/login")}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                <SafetyCertificateOutlined />
                Start as a guest
              </div>
              <h1 className="m-0 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Build a polished CV before the next application closes.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Pick a professional layout, import from LinkedIn, and edit with a live preview designed for quick, focused resume work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  disabled={Boolean(loadingTemplate)}
                  onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-12 rounded-lg border-none bg-blue-600 px-6 font-bold shadow-[0_12px_30px_rgba(37,99,235,0.24)] hover:!bg-blue-700"
                >
                  Choose a template
                </Button>
                <Button
                  size="large"
                  icon={<LinkedinFilled />}
                  disabled={Boolean(loadingTemplate)}
                  onClick={() => setImportOpen(true)}
                  className="h-12 rounded-lg border-slate-300 px-5 font-bold text-slate-700 shadow-none"
                >
                  Import from LinkedIn
                </Button>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
                <div className="px-4 py-3">
                  <p className="m-0 text-lg font-black text-slate-950">5</p>
                  <p className="m-0 text-xs font-medium text-slate-500">Templates</p>
                </div>
                <div className="px-4 py-3">
                  <p className="m-0 text-lg font-black text-slate-950">PDF</p>
                  <p className="m-0 text-xs font-medium text-slate-500">Export ready</p>
                </div>
                <div className="px-4 py-3">
                  <p className="m-0 text-lg font-black text-slate-950">Live</p>
                  <p className="m-0 text-xs font-medium text-slate-500">Preview</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.13)] sm:p-6">
              <div className="absolute left-6 top-6 z-10 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
                <p className="m-0 text-xs font-bold uppercase tracking-wide text-slate-400">Status</p>
                <p className="m-0 mt-1 text-sm font-black text-slate-900">Ready to export</p>
              </div>
              <div className="absolute bottom-6 right-6 z-10 hidden w-52 rounded-lg border border-slate-200 bg-white p-4 shadow-lg sm:block">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Sections</span>
                  <CheckCircleFilled className="text-emerald-500" />
                </div>
                <div className="space-y-2">
                  {["Profile", "Experience", "Skills", "Education"].map((item) => (
                    <div key={item} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{item}</span>
                      <span className="h-1.5 w-10 rounded-full bg-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-8 w-full max-w-[440px] rounded-lg bg-white p-7 shadow-2xl ring-1 ring-slate-200 sm:mt-4">
                <div className="mb-6 flex items-start justify-between border-b border-slate-200 pb-5">
                  <div>
                    <div className="mb-2 h-3 w-24 rounded bg-blue-600" />
                    <div className="h-7 w-56 rounded bg-slate-900" />
                    <div className="mt-3 h-2 w-44 rounded bg-slate-200" />
                  </div>
                  <div className="h-16 w-16 rounded-lg bg-slate-200" />
                </div>
                <div className="grid grid-cols-[0.62fr_0.38fr] gap-6">
                  <div className="space-y-5">
                    {[0, 1, 2].map((item) => (
                      <div key={item}>
                        <div className="mb-3 h-2.5 w-24 rounded bg-slate-800" />
                        <div className="space-y-2">
                          <div className="h-2 rounded bg-slate-200" />
                          <div className="h-2 rounded bg-slate-200" />
                          <div className="h-2 w-3/4 rounded bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 rounded-lg bg-slate-50 p-4">
                    <div>
                      <div className="mb-3 h-2.5 w-16 rounded bg-teal-600" />
                      <div className="space-y-2">
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 w-5/6 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 h-2.5 w-20 rounded bg-amber-500" />
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3].map((item) => (
                          <span key={item} className="h-5 w-14 rounded bg-white ring-1 ring-slate-200" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="templates" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-600">
                <LayoutOutlined />
                Template library
              </div>
              <h2 className="m-0 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Choose a starting point</h2>
              <p className="m-0 mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Each template opens directly into the editor with live preview, layout controls, and export tools.
              </p>
            </div>
            <Button
              icon={<LinkedinFilled />}
              disabled={Boolean(loadingTemplate)}
              onClick={() => setImportOpen(true)}
              className="h-10 rounded-lg border-slate-300 font-bold text-slate-700"
            >
              Import first
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(TEMPLATES).map((template) => (
              <Card
                hoverable
                key={template.id}
                className="group flex h-full flex-col overflow-hidden rounded-lg border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', flexGrow: 1 } }}
              >
                <div className="relative h-60 overflow-hidden border-b border-slate-100 bg-slate-100 p-5">
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-300 group-hover:bg-slate-950/45 group-hover:opacity-100">
                    <Button 
                      type="primary" 
                      size="large"
                      loading={loadingTemplate === template.id}
                      disabled={Boolean(loadingTemplate)}
                      className="h-11 translate-y-3 rounded-lg border-none bg-blue-600 px-6 text-sm font-bold shadow-lg transition-all duration-300 hover:bg-blue-700 group-hover:translate-y-0"
                      icon={<RightOutlined />}
                      onClick={() => openTemplateChoice(template.id)}
                    >
                      Use template
                    </Button>
                  </div>
                  
                  <div className="absolute right-4 top-4 z-[1] rounded bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500 shadow-sm ring-1 ring-slate-200">
                    {templateBadges[template.id]}
                  </div>

                  <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="pointer-events-none absolute left-1/2 top-3 w-[900px] origin-top -translate-x-1/2 scale-[0.24] md:scale-[0.27] lg:scale-[0.24] xl:scale-[0.27]">
                      <ResumeTemplate data={sampleResumeData} template={template.id} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="m-0 text-lg font-black text-slate-900">{template.name}</h3>
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: template.accentColor }} />
                    </div>
                    <p className="mb-5 mt-0 text-sm leading-6 text-slate-600">{templateDescriptions[template.id]}</p>
                  </div>
                  <Button 
                    block
                    className="h-10 rounded-lg border-blue-100 bg-blue-50/70 font-bold text-blue-700 md:hidden"
                    loading={loadingTemplate === template.id}
                    disabled={Boolean(loadingTemplate)}
                    onClick={() => openTemplateChoice(template.id)}
                  >
                    Choose template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-0 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
            <div className="flex gap-4 border-b border-slate-200 py-6 md:border-b-0 md:border-r md:pr-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <HighlightOutlined className="text-lg text-blue-600" />
              </div>
              <div>
                <h4 className="m-0 text-base font-black text-slate-950">Real-time preview</h4>
                <p className="m-0 mt-2 text-sm leading-6 text-slate-600">See content and spacing update instantly as your CV takes shape.</p>
              </div>
            </div>
            <div className="flex gap-4 border-b border-slate-200 py-6 md:border-b-0 md:border-r md:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <FileDoneOutlined className="text-lg text-amber-600" />
              </div>
              <div>
                <h4 className="m-0 text-base font-black text-slate-950">PDF export</h4>
                <p className="m-0 mt-2 text-sm leading-6 text-slate-600">Download a clean, submission-ready PDF from the editor.</p>
              </div>
            </div>
            <div className="flex gap-4 py-6 md:pl-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <CheckCircleFilled className="text-lg text-teal-600" />
              </div>
              <div>
                <h4 className="m-0 text-base font-black text-slate-950">Guest workflow</h4>
                <p className="m-0 mt-2 text-sm leading-6 text-slate-600">Start immediately and move into an account only when needed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
