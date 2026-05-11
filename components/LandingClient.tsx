"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Row, Col, Typography, message } from "antd";
import { 
  RightOutlined, 
  FileDoneOutlined, 
  LayoutOutlined, 
  HighlightOutlined, 
  CheckCircleFilled 
} from "@ant-design/icons";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";
import type { TemplateId } from "@/lib/resume-types";

const { Title, Text, Paragraph } = Typography;

export function LandingClient() {
  const router = useRouter();
  const [loadingTemplate, setLoadingTemplate] = useState<TemplateId | null>(null);

  const handleSelectTemplate = async (templateId: TemplateId) => {
    setLoadingTemplate(templateId);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateId }),
      });

      if (!res.ok) throw new Error("Failed to create");

      const data = await res.json();
      router.push(`/resumes/${data.id}`);
    } catch (err) {
      message.error("Something went wrong creating your resume.");
      setLoadingTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">CV</div>
          <span className="text-lg font-bold tracking-tight text-slate-800">CV Builder</span>
        </div>
        <div>
          <Button 
            type="link" 
            className="font-bold text-slate-600"
            onClick={() => router.push("/login")}
          >
            Sign In
          </Button>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 font-bold rounded-lg shadow-md shadow-blue-600/20 ml-2"
            onClick={() => router.push("/login")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col items-center">
        <div className="text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            🚀 Fast & Intuitive Resume Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-6">
            Build your dream career with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              stunning professional CVs
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Create a professional, job-winning resume in minutes. Choose from our expertly crafted templates and start applying today – <span className="text-slate-800 font-semibold">no account required to start!</span>
          </p>
        </div>

        {/* Template Showcase Grid */}
        <div className="w-full max-w-5xl">
          <div className="flex items-center gap-2 mb-8">
            <LayoutOutlined className="text-blue-600 text-xl" />
            <h2 className="text-2xl font-extrabold text-slate-800 m-0">Select a Base Template</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(TEMPLATES).map((template) => (
              <Card
                hoverable
                key={template.id}
                className="overflow-hidden border-slate-200/60 transition-all duration-300 hover:shadow-xl group rounded-2xl flex flex-col h-full bg-white"
                styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', flexGrow: 1 } }}
              >
                {/* Placeholder "Fake Document Preview" using CSS */}
                <div className="h-56 bg-slate-50 p-6 relative group overflow-hidden border-b border-slate-100">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100">
                    <Button 
                      type="primary" 
                      size="large"
                      loading={loadingTemplate === template.id}
                      className="font-bold text-sm shadow-lg h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-none"
                      icon={<RightOutlined />}
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      Use this Template
                    </Button>
                  </div>
                  
                  {/* Fake doc design that changes by template */}
                  <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col p-4 transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className={`h-4 rounded w-3/4 mb-3`} style={{ backgroundColor: template.accentColor }}></div>
                    <div className="h-2 bg-slate-100 rounded w-1/2 mb-4"></div>
                    
                    {template.id === 'creative' ? (
                      <div className="flex gap-3 flex-1">
                        <div className="w-1/3 flex flex-col gap-2">
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-20 bg-slate-50 rounded w-full border border-dashed border-slate-200"></div>
                        </div>
                      </div>
                    ) : template.id === 'sea' ? (
                      <div className="flex gap-3 flex-1 flex-row-reverse">
                        <div className="w-1/3 bg-slate-50 rounded p-2 flex flex-col gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 mx-auto"></div>
                          <div className="h-1 bg-slate-200 rounded w-full"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                           <div className="h-2 bg-slate-100 rounded w-full"></div>
                           <div className="h-2 bg-slate-100 rounded w-full"></div>
                           <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-2 bg-slate-100 rounded w-full"></div>
                        <div className="h-2 bg-slate-100 rounded w-full"></div>
                        <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                        <div className="flex gap-2 mt-2">
                          <div className="h-12 flex-1 bg-slate-50 border border-dashed border-slate-200 rounded"></div>
                          <div className="h-12 flex-1 bg-slate-50 border border-dashed border-slate-200 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Text className="text-lg font-bold text-slate-800">{template.name}</Text>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.accentColor }}></div>
                    </div>
                    <Text type="secondary" className="text-xs block mb-4">
                      Professional layout optimized for {template.id === 'corporate' ? 'corporate roles' : template.id === 'creative' ? 'design agencies' : 'modern recruitment'}.
                    </Text>
                  </div>
                  <Button 
                    block
                    className="md:hidden font-bold text-blue-600 border-blue-100 bg-blue-50/50"
                    loading={loadingTemplate === template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    Choose Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Feature bar */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <HighlightOutlined className="text-blue-400 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">Real-time Preview</h4>
              <p className="text-slate-400 text-sm">See updates instantly as you type. No need to refresh or generate.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
              <FileDoneOutlined className="text-indigo-400 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">Premium PDF Export</h4>
              <p className="text-slate-400 text-sm">High quality vector-based PDF downloads ready for submission.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
              <CheckCircleFilled className="text-teal-400 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">No Login Required</h4>
              <p className="text-slate-400 text-sm">Jump straight into building. Save or export immediately as a guest.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
