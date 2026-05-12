"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Checkbox, Col, Form, Input, Modal, Radio, Row, Segmented, Select, Space, Tabs, Typography, message } from "antd";
import {
  DownloadOutlined,
  SaveOutlined,
  ShareAltOutlined,
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  StarOutlined,
  TrophyOutlined,
  SettingOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  HolderOutlined,
  DownOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  CheckOutlined,
  WarningOutlined,
  LoginOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ResumeData, ResumeRecord, TemplateId } from "@/lib/resume-types";
import { useResumeStore } from "@/lib/resume-store";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";

import { SortableSectionCard, SortableLayoutItem, FieldList, SkillsFieldList, LanguagesFieldList } from "./editor/SortableFields";
import { TemplateTab } from "./editor/TemplateTab";
import { LayoutTab } from "./editor/LayoutTab";
import { PreviewPanel } from "./editor/PreviewPanel";
import { TextTab } from "./editor/TextTab";
type Props = {
  resume: ResumeRecord;
  isLoggedIn?: boolean;
};

export function ResumeEditor({ resume, isLoggedIn = false }: Props) {
  const router = useRouter();
  const [form] = Form.useForm();
  const isInitialized = useRef(false);
  const { title, slug, template, data, isPublic, setData, setMeta } = useResumeStore();
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(["personal", "summary"]);
  const [activeTab, setActiveTab] = useState<"template" | "text" | "layout">("text");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [authUpsellOpen, setAuthUpsellOpen] = useState(false);
  const [authUpsellMode, setAuthUpsellMode] = useState<'soft' | 'hard'>('soft');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // New: Premium exit warning state
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

  const toggleSection = (key: string) => {
    setActiveSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const [sectionsOrder, setSectionsOrder] = useState<string[]>([
    "personal",
    "summary",
    "experience",
    "education",
    "skills-languages",
    "extras",
    "settings",
  ]);

  const sectionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionsOrder((items) => {
        const oldIdx = items.indexOf(active.id as string);
        const newIdx = items.indexOf(over.id as string);
        const nextOrder = arrayMove(items, oldIdx, newIdx);
        setTimeout(() => {
          syncPreview(nextOrder);
          setIsDirty(true);
        }, 0);
        return nextOrder;
      });
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (resume.dataJson.sectionsOrder && resume.dataJson.sectionsOrder.length > 0) {
      setSectionsOrder(resume.dataJson.sectionsOrder);
    }

    setMeta({
      title: resume.title,
      slug: resume.slug,
      template: resume.template,
      isPublic: resume.isPublic,
    });
    setData(resume.dataJson);
    form.setFieldsValue({
      title: resume.title,
      slug: resume.slug,
      template: resume.template,
      isPublic: resume.isPublic,
      ...resume.dataJson.personal,
      summary: resume.dataJson.summary,
      skills: (resume.dataJson.skills || []).map((skillStr: string) => {
        const match = skillStr.match(/^(.+?)(?:\s*[\(:-]\s*(.+?)\s*\)?\s*)$/);
        if (match) {
          return { name: match[1].trim(), level: match[2].trim().replace(/\)$/, "") };
        }
        return { name: skillStr, level: "" };
      }),
      languages: (resume.dataJson.languages || []).map((langStr: string) => {
        const match = langStr.match(/^(.+?)(?:\s*[\(:-]\s*(.+?)\s*\)?\s*)$/);
        if (match) {
          return { name: match[1].trim(), level: match[2].trim().replace(/\)$/, "") };
        }
        return { name: langStr, level: "" };
      }),
      skillLevelStyle: resume.dataJson.skillLevelStyle || "line",
      color: resume.dataJson.color || "",
      experience: resume.dataJson.experience,
      education: resume.dataJson.education,
      projects: resume.dataJson.projects,
      certifications: resume.dataJson.certifications,
    });
  }, [form, resume, setData, setMeta]);

  const previewData = useMemo(() => data, [data]);
  const saveBadgeLabel = saving ? "Saving..." : isDirty ? "Unsaved Changes" : "Saved";
  const saveBadgeClassName = saving
    ? "bg-amber-50 text-amber-700"
    : isDirty
      ? "bg-rose-50 text-rose-700"
      : "bg-emerald-50 text-emerald-700";

  function syncPreview(overrideSections?: string[]) {
    const allValues = form.getFieldsValue(true);
    const nextData: ResumeData = {
      personal: {
        name: String(allValues.name || ""),
        headline: String(allValues.headline || ""),
        email: String(allValues.email || ""),
        phone: String(allValues.phone || ""),
        location: String(allValues.location || ""),
        website: String(allValues.website || ""),
        image: allValues.image ? String(allValues.image) : undefined,
      },
      summary: String(allValues.summary || ""),
      skills: ((allValues.skills as Array<{ name?: string; level?: string }>) || [])
        .filter((s) => s && s.name)
        .map((s) => (s.level ? `${s.name} (${s.level})` : (s.name as string))),
      languages: ((allValues.languages as Array<{ name?: string; level?: string }>) || [])
        .filter((l) => l && l.name)
        .map((l) => (l.level ? `${l.name} (${l.level})` : (l.name as string))),
      sectionsOrder: overrideSections || sectionsOrder,
      skillLevelStyle: (allValues.skillLevelStyle as "line" | "stars" | "none") || "line",
      color: allValues.color ? String(allValues.color) : undefined,
      experience: (allValues.experience as ResumeData["experience"]) || [],
      education: (allValues.education as ResumeData["education"]) || [],
      projects: (allValues.projects as ResumeData["projects"]) || [],
      certifications: (allValues.certifications as ResumeData["certifications"]) || [],
    };

    setData(nextData);
    setMeta({
      title: String(allValues.title || ""),
      slug: String(allValues.slug || ""),
      template: (allValues.template as TemplateId) || "modern",
      isPublic: Boolean(allValues.isPublic),
    });
    setIsDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, template, isPublic, dataJson: data }),
      });

      if (!response.ok) {
        message.error("Could not save resume.");
        return;
      }

      message.success("Resume saved successfully.");
      setIsDirty(false);
      router.refresh();
    } catch {
      message.error("Could not save resume.");
    } finally {
      setSaving(false);
    }
  }

  function handleGoHome() {
    const dest = isLoggedIn ? "/dashboard" : "/";
    
    if (!isLoggedIn || isDirty) {
      // Open our new premium confirmation instead of default browser alert
      setLeaveConfirmOpen(true);
    } else {
      router.push(dest);
    }
  }

  function handlePrepareDownload() {
    const proceed = () => {
      setExportFileName(title || "My_Resume");
      setExportModalOpen(true);
    };

    if (!isLoggedIn) {
      setPendingAction(() => proceed);
      setAuthUpsellMode('soft');
      setAuthUpsellOpen(true);
    } else {
      proceed();
    }
  }

  function handleShareClick(e: React.MouseEvent) {
    if (!isLoggedIn) {
      e.preventDefault(); // Stop navigating immediately
      setPendingAction(null); // Explicitly null for hard mode
      setAuthUpsellMode('hard');
      setAuthUpsellOpen(true);
    }
  }

  async function handleConfirmDownload() {
    setIsDownloading(true);
    try {
      // 1. Sync the confirmed file name to the state and form
      const cleanedName = exportFileName.trim() || "My_Resume";
      setMeta({ title: cleanedName });
      form.setFieldValue("title", cleanedName);

      // 2. Fire off an auto-save to ensure latest data persists before Puppeteer renders PDF
      const saveResponse = await fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanedName,
          slug,
          template,
          isPublic,
          dataJson: data
        }),
      });

      if (!saveResponse.ok) {
        message.error("Failed to prepare resume for export.");
        return;
      }

      setIsDirty(false);

      // 3. Redirect/Trigger download with clean safe slug name for the query param
      const safeName = cleanedName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const downloadUrl = `/api/resumes/${resume.id}/export/pdf?template=${template}${
        data.color ? `&accent=${encodeURIComponent(data.color)}` : ""
      }&filename=${encodeURIComponent(safeName)}`;

      setExportModalOpen(false);
      window.location.href = downloadUrl;
    } catch (err) {
      message.error("An error occurred while preparing your download.");
    } finally {
      setIsDownloading(false);
    }
  }


  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-6">
        <div className="flex items-center gap-4">
          <div 
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-base font-bold text-slate-900 transition-colors hover:bg-slate-50"
            onClick={handleGoHome}
            title="Back to Dashboard"
          >
            CV
          </div>
          <div>
            <div className="flex items-center gap-2 h-[24px]">
              {isEditingTitle ? (
                <Input
                  size="small"
                  autoFocus
                  className="h-7 w-[240px] -ml-1 border-slate-300 bg-white text-[15px] font-semibold text-slate-800 shadow-none"
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMeta({ title: val });
                    form.setFieldValue("title", val);
                    setIsDirty(true);
                  }}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    if (!title.trim()) setMeta({ title: "Untitled Resume" });
                  }}
                  onPressEnter={() => setIsEditingTitle(false)}
                />
              ) : (
                <Typography.Text 
                  className="flex cursor-pointer items-center rounded border border-transparent px-1 text-[15px] font-semibold text-slate-800 transition-all hover:border-slate-200 hover:bg-slate-50 -ml-1"
                  onClick={() => setIsEditingTitle(true)}
                  title="Click to rename resume"
                >
                  {title || "Untitled Resume"}
                </Typography.Text>
              )}
              <span className={`rounded-md px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${saveBadgeClassName}`}>
                {saveBadgeLabel}
              </span>
            </div>
            <Typography.Text type="secondary" className="text-xs text-slate-500">
              Resume editor
            </Typography.Text>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            icon={<SaveOutlined />}
            type="primary"
            loading={saving}
            onClick={save}
            className="h-10 rounded-md border-none bg-slate-900 px-4 text-xs font-semibold shadow-none hover:bg-slate-800"
          >
            Save
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handlePrepareDownload}
            className="flex h-10 items-center rounded-md border-slate-200 px-4 text-xs font-semibold text-slate-700 shadow-none hover:border-slate-300 hover:text-slate-900"
          >
            Export PDF
          </Button>
          {isPublic ? (
            <Button
              icon={<ShareAltOutlined />}
              href={`/cv/${slug}`}
              target="_blank"
              onClick={handleShareClick}
              className="flex h-10 items-center rounded-md border-slate-200 px-4 text-xs font-semibold text-slate-600 shadow-none"
            >
              Share
            </Button>
          ) : null}
        </div>
      </header>

      {/* Editor Main Content Panels */}
      {(() => {
        const sectionConfigs: Record<string, { title: string; description?: string; icon: React.ReactNode; content: React.ReactNode }> = {
          personal: {
            title: "Personal Details",
            description: "Provide your basic contact details and profile photo to highlight your personality.",
            icon: <UserOutlined />,
            content: (
              <>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</span>}
                    >
                      <Input placeholder="John Doe" className="rounded-lg h-10" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="headline"
                      label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Headline</span>}
                    >
                      <Input placeholder="Frontend Developer" className="rounded-lg h-10" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Base64 Profile Photo Uploader */}
                <Form.Item noStyle dependencies={["image"]}>
                  {() => {
                    const img = form.getFieldValue("image");
                    return (
                      <div className="mb-4 flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        {img ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 group shadow-sm">
                            <img src={img} alt="Profile" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setTimeout(() => {
                                  form.setFieldValue("image", undefined);
                                  syncPreview();
                                }, 0);
                              }}
                              className="absolute inset-0 bg-black/50 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 flex-shrink-0 font-bold">
                            No Photo
                          </div>
                        )}
                        <div>
                          <Typography.Text className="block font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">
                            Profile Photo
                          </Typography.Text>
                          <input
                            type="file"
                            accept="image/*"
                            id="profile-photo-upload"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setTimeout(() => {
                                    form.setFieldValue("image", reader.result);
                                    syncPreview();
                                  }, 0);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Button
                            size="small"
                            onClick={() => document.getElementById("profile-photo-upload")?.click()}
                            className="rounded-lg font-bold text-[11px] border-slate-200 text-slate-600 shadow-sm"
                          >
                            Upload Photo
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </Form.Item>
                <Form.Item name="image" noStyle>
                  <Input type="hidden" />
                </Form.Item>

                <Row gutter={12}>
                  {["email", "phone", "location", "website"].map((field) => (
                    <Col xs={24} md={12} key={field}>
                      <Form.Item
                        name={field}
                        label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{field}</span>}
                      >
                        <Input placeholder={`Enter ${field}...`} className="rounded-lg h-10" />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </>
            )
          },
          summary: {
            title: "Professional Summary",
            description: "Summarize your overall career background, core goals, and high-level impacts.",
            icon: <FileTextOutlined />,
            content: (
              <Form.Item name="summary" noStyle>
                <Input.TextArea
                  rows={5}
                  placeholder="Write a brief professional summary about your skills, accomplishments, and career goals..."
                  className="rounded-xl p-3"
                />
              </Form.Item>
            )
          },
          experience: {
            title: "Employment History",
            description: "Show your relevant experience (last 10 years). Use bullet points to note achievements.",
            icon: <FileTextOutlined />,
            content: (
              <FieldList
                form={form}
                name="experience"
                fields={["role", "company", "startDate", "endDate", "description"]}
                icon={<FileTextOutlined />}
                placeholderAdd="Add Position"
              />
            )
          },
          education: {
            title: "Education",
            description: "A diverse background on your profile highlights your unique skills and educational journey.",
            icon: <BookOutlined />,
            content: (
              <FieldList
                form={form}
                name="education"
                fields={["degree", "school", "startDate", "endDate", "description"]}
                icon={<BookOutlined />}
                placeholderAdd="Add Education"
              />
            )
          },
          "skills-languages": {
            title: "Skills & Languages",
            description: "Pinpoint core skills and add foreign languages you speak to prove adaptability.",
            icon: <StarOutlined />,
            content: (
              <div className="grid gap-6">
                <Form.Item
                  name="skillLevelStyle"
                  label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Skill Level Indicator</span>}
                  className="mb-0"
                >
                  <Segmented
                    block
                    className="w-full bg-slate-100 p-1 rounded-xl text-slate-600 font-bold text-xs"
                    options={[
                      { label: "Line Indicator", value: "line" },
                      { label: "Star Rating", value: "stars" },
                      { label: "No Level", value: "none" }
                    ]}
                  />
                </Form.Item>
                <SkillsFieldList />
                <div className="border-t border-slate-100/60 pt-4">
                  <LanguagesFieldList />
                </div>
              </div>
            )
          },
          extras: {
            title: "Projects & Certifications",
            description: "Display industry-recognized endorsements and independent showcase items.",
            icon: <TrophyOutlined />,
            content: (
              <div className="grid gap-6">
                <div>
                  <Typography.Text className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-3">Projects</Typography.Text>
                  <FieldList
                    form={form}
                    name="projects"
                    fields={["name", "link", "description"]}
                    icon={<TrophyOutlined />}
                    placeholderAdd="Add Project"
                  />
                </div>
                <div className="border-t border-slate-100/60 pt-4">
                  <Typography.Text className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-3">Certifications</Typography.Text>
                  <FieldList
                    form={form}
                    name="certifications"
                    fields={["name", "issuer", "date"]}
                    icon={<TrophyOutlined />}
                    placeholderAdd="Add Certification"
                  />
                </div>
              </div>
            )
          },
          settings: {
            title: "Sharing & Settings",
            description: "Define sharing rules and internal reference tags for versioning.",
            icon: <SettingOutlined />,
            content: (
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Resume Title</span>}
                  >
                    <Input placeholder="My Resume" className="rounded-lg h-10" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="slug"
                    label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Public Slug</span>}
                  >
                    <Input placeholder="my-resume" className="rounded-lg h-10" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="isPublic" valuePropName="checked" className="mb-0 mt-2">
                    <Checkbox className="font-bold text-slate-600 text-xs uppercase tracking-wide">Publish this resume publicly</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            )
          }
        };

        return (
          <div className="grid h-[calc(100vh-64px)] flex-1 grid-cols-[minmax(420px,560px)_1fr] overflow-hidden max-xl:grid-cols-1">
            <div className="flex h-full flex-col overflow-hidden border-r border-slate-200 bg-slate-50/70">
              <div className="border-b border-slate-200 bg-white px-5 py-4">
                <div className="mb-4">
                  <p className="m-0 text-sm font-semibold text-slate-900">Workspace</p>
                  <p className="mt-1 text-xs text-slate-500">Edit content, change template, and control document order.</p>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
                {([
                  { key: 'text', label: 'Text' },
                  { key: 'template', label: 'Style' },
                  { key: 'layout', label: 'Layout' }
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-md px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all ${
                      activeTab === tab.key 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              </div>

              <Form form={form} layout="vertical" onValuesChange={syncPreview} className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-5">
                  {activeTab === 'template' && (
                    <TemplateTab
                      data={data}
                      template={template}
                      form={form}
                      syncPreview={syncPreview}
                    />
                  )}
                  {activeTab === 'text' && (
                    <TextTab
                      sectionsOrder={sectionsOrder}
                      sectionConfigs={sectionConfigs}
                      activeSections={activeSections}
                      toggleSection={toggleSection}
                    />
                  )}
                  {activeTab === 'layout' && (
                    <LayoutTab
                      sectionSensors={sectionSensors}
                      handleSectionDragEnd={handleSectionDragEnd}
                      sectionsOrder={sectionsOrder}
                      sectionConfigs={sectionConfigs}
                    />
                  )}
                </div>
              </Form>
            </div>

            <PreviewPanel previewData={previewData} template={template} />
          </div>
        );
      })()}
      {/* PREMIUM EXPORT MODAL */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileTextOutlined className="text-base" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-800 text-[16px]">Ready to Download?</span>
          </div>
        }
        open={exportModalOpen}
        onCancel={() => !isDownloading && setExportModalOpen(false)}
        footer={[
          <Button 
            key="back" 
            onClick={() => setExportModalOpen(false)} 
            disabled={isDownloading}
            className="rounded-lg font-bold text-xs text-slate-600 border-slate-200 h-10 px-4"
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isDownloading}
            onClick={handleConfirmDownload}
            icon={<DownloadOutlined />}
            className="bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-lg h-10 px-5 border-none shadow-md shadow-blue-500/20"
          >
            Confirm & Save PDF
          </Button>,
        ]}
        centered
        width={420}
      >
        <div className="py-3">
          <Typography.Text className="text-xs text-slate-500 leading-relaxed font-medium block mb-4 bg-blue-50/40 p-3 rounded-xl border border-blue-50">
            We automatically save your latest changes before generating the PDF to ensure the export has the absolutely freshest version of your work.
          </Typography.Text>
          
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 pl-1">
            Resume Export Name
          </label>
          <Input 
            autoFocus
            value={exportFileName}
            onChange={(e) => setExportFileName(e.target.value)}
            placeholder="e.g. My Professional CV"
            className="rounded-xl h-12 font-semibold text-slate-800 border-slate-200 focus:border-blue-400 shadow-sm"
            onPressEnter={handleConfirmDownload}
            suffix={<span className="text-slate-400 text-[13px] font-black bg-slate-50 px-2 py-1 rounded-md">.pdf</span>}
          />
        </div>
      </Modal>
      {/* AUTH UPSELL MODAL FOR GUESTS */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <StarOutlined className="text-base" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-800 text-[16px]">
              {authUpsellMode === 'hard' ? "Account Required" : "Save Your Progress?"}
            </span>
          </div>
        }
        open={authUpsellOpen}
        onCancel={() => setAuthUpsellOpen(false)}
        footer={[
          authUpsellMode === 'soft' && (
            <Button 
              key="guest" 
              onClick={() => {
                setAuthUpsellOpen(false);
                if (pendingAction) pendingAction();
                setPendingAction(null);
              }} 
              className="rounded-lg font-bold text-xs text-slate-600 border-slate-200 h-10 px-4"
            >
              Continue as Guest
            </Button>
          ),
          <Button 
            key="login" 
            type="primary" 
            onClick={() => {
              router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-lg h-10 px-5 border-none shadow-md shadow-blue-500/20"
          >
            Login / Create Account
          </Button>,
        ].filter(Boolean)}
        centered
        width={400}
      >
        <div className="py-3">
          <Typography.Paragraph className="text-sm text-slate-600 leading-relaxed mb-0">
            {authUpsellMode === 'hard' 
              ? "To share your resume via a public link, you must have an account. Create a free account now to enable public sharing!"
              : "You are creating this resume as a guest. Create a free account to manage your documents later, or continue as a guest to finish now."
            }
          </Typography.Paragraph>
        </div>
      </Modal>

      {/* Leaving Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-start gap-3 pr-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
              <WarningOutlined className="text-lg" />
            </div>
            <div className="min-w-0">
              <span className="block text-[17px] font-extrabold leading-6 tracking-tight text-slate-900">
                {isLoggedIn ? "Leave without saving?" : "Save this resume before leaving?"}
              </span>
              <span className="mt-1 block text-[13px] font-medium leading-5 text-slate-500">
                {isLoggedIn
                  ? "Your latest edits are only on this screen."
                  : "Guest resumes are not kept after you leave this editor."}
              </span>
            </div>
          </div>
        }
        open={leaveConfirmOpen}
        onCancel={() => setLeaveConfirmOpen(false)}
        centered
        width={460}
        footer={null}
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-close]:!top-4 [&_.ant-modal-close]:!right-4 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-header]:!rounded-t-2xl [&_.ant-modal-header]:!border-b [&_.ant-modal-header]:!border-slate-100 [&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!py-5 [&_.ant-modal-body]:!px-6 [&_.ant-modal-body]:!py-5"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Typography.Paragraph className="!mb-0 text-[13.5px] font-medium leading-6 text-slate-600">
              {isLoggedIn 
                ? "If you leave now, the unsaved changes in this editing session will be discarded. Stay here to keep working, or leave and return to your dashboard."
                : "Create a free account to keep this resume and continue editing it later. You can still leave now and go back to the home page."
              }
            </Typography.Paragraph>
          </div>

          <div className="grid gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between gap-3 rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-[12px] font-bold uppercase tracking-wide text-blue-700">
                Recommended
              </div>
              <div className="text-right text-[12px] font-semibold text-blue-700">
                {isLoggedIn ? "Keep your edits" : "Save for later"}
              </div>
            </div>

            {!isLoggedIn ? (
              <Button 
                type="primary"
                icon={<LoginOutlined />}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-none bg-blue-600 text-sm font-bold shadow-lg shadow-blue-600/20 hover:!bg-blue-700"
                onClick={() => {
                  setLeaveConfirmOpen(false);
                  router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
                }}
              >
                Save with Free Account
              </Button>
            ) : (
              <Button 
                type="primary"
                className="h-12 rounded-xl border-none bg-blue-600 text-sm font-bold shadow-lg shadow-blue-600/20 hover:!bg-blue-700"
                onClick={() => setLeaveConfirmOpen(false)}
              >
                Stay and Keep Editing
              </Button>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              danger
              type="text"
              icon={<ArrowLeftOutlined />}
              className="h-11 flex-1 rounded-xl text-[13px] font-bold hover:!bg-red-50"
              onClick={() => {
                setLeaveConfirmOpen(false);
                router.push(isLoggedIn ? "/dashboard" : "/");
              }}
            >
              Discard and Leave
            </Button>

            {!isLoggedIn ? (
              <Button
                className="h-11 flex-1 rounded-xl border-slate-200 text-[13px] font-bold text-slate-700 hover:!border-blue-300 hover:!text-blue-700"
                onClick={() => setLeaveConfirmOpen(false)}
              >
                Stay and Edit
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}
