"use client";

import { Button, Card, Empty, Space, Tag, Typography, message, Dropdown, MenuProps } from "antd";
import { 
  CopyOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  FileAddOutlined, 
  LogoutOutlined, 
  MoreOutlined, 
  EyeOutlined, 
  GlobalOutlined, 
  LockOutlined, 
  CalendarOutlined 
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ResumeRecord } from "@/lib/resume-types";
import { TEMPLATES } from "../resume/TemplateRegistry";

const { Title, Text } = Typography;

type Props = {
  resumes: ResumeRecord[];
};

export function DashboardClient({ resumes }: Props) {
  const router = useRouter();

  async function createResume() {
    const response = await fetch("/api/resumes", { method: "POST" });
    if (!response.ok) {
      message.error("Could not create resume.");
      return;
    }
    const resume = await response.json();
    router.push(`/resumes/${resume.id}`);
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/";
  }

  async function duplicateResume(id: string) {
    const response = await fetch(`/api/resumes/${id}/duplicate`, { method: "POST" });
    if (!response.ok) {
      message.error("Could not duplicate resume.");
      return;
    }
    router.refresh();
    message.success("Resume duplicated successfully.");
  }

  async function deleteResume(id: string) {
    const response = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      message.error("Could not delete resume.");
      return;
    }
    router.refresh();
    message.success("Resume deleted.");
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Custom Premium Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm mb-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">CV</div>
            <span className="font-bold text-lg tracking-tight text-slate-800">CV Online</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              icon={<LogoutOutlined className="text-xs" />} 
              onClick={handleLogout}
              type="text"
              className="font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 text-xs px-3 h-9 rounded-lg hover:bg-red-50 transition-all"
            >
              Sign Out
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-xs cursor-pointer">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Top Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
              User Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight m-0">
              My Resumes
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">
              Manage, edit, and track your professional portfolio documents.
            </p>
          </div>

          <Button 
            type="primary" 
            size="large"
            icon={<FileAddOutlined />} 
            onClick={createResume}
            className="h-12 px-6 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 border-none flex items-center gap-2"
          >
            Create New Resume
          </Button>
        </div>

        {/* Resumes Dashboard Content */}
        {!resumes.length ? (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-16 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileAddOutlined className="text-3xl text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Resumes Found</h3>
            <p className="text-slate-500 mb-8 max-w-sm font-medium text-sm">
              You haven't created any resumes yet. Kickstart your career search by building your first professional CV now.
            </p>
            <Button 
              type="primary" 
              size="large" 
              onClick={createResume}
              className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl h-12 px-8 border-none"
            >
              Start Building
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {resumes.map((resume) => {
              const templateConfig = TEMPLATES[resume.template as keyof typeof TEMPLATES];
              
              const menuItems: MenuProps['items'] = [
                { 
                  key: 'edit', 
                  label: 'Edit Document', 
                  icon: <EditOutlined />, 
                  onClick: () => router.push(`/resumes/${resume.id}`) 
                },
                { 
                  key: 'preview', 
                  label: 'View Public Page', 
                  icon: <EyeOutlined />, 
                  disabled: !resume.isPublic,
                  onClick: () => window.open(`/cv/${resume.slug}`, '_blank') 
                },
                { type: 'divider' },
                { 
                  key: 'duplicate', 
                  label: 'Duplicate', 
                  icon: <CopyOutlined />, 
                  onClick: () => duplicateResume(resume.id) 
                },
                { 
                  key: 'delete', 
                  label: 'Delete', 
                  icon: <DeleteOutlined />, 
                  danger: true, 
                  onClick: () => deleteResume(resume.id) 
                },
              ];

              return (
                <div key={resume.id} className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  
                  {/* Visual Representation / Header */}
                  <div 
                    className="h-40 relative flex items-center justify-center overflow-hidden group-hover:brightness-95 transition-all duration-300 bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/resumes/${resume.id}`)}
                  >
                    {/* Dynamic subtle template colored background pattern */}
                    <div 
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundColor: templateConfig?.accentColor || "#3b82f6",
                        backgroundImage: "radial-gradient(#000 10%, transparent 10%)",
                        backgroundSize: "10px 10px"
                      }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div 
                        className="w-14 h-18 bg-white rounded border border-slate-200 shadow-md flex flex-col p-2 transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 overflow-hidden"
                      >
                        <div className="w-full h-1 rounded mb-1" style={{ backgroundColor: templateConfig?.accentColor || "#eee" }}></div>
                        <div className="w-2/3 h-1 bg-slate-100 rounded mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-full h-0.5 bg-slate-50"></div>
                          <div className="w-full h-0.5 bg-slate-50"></div>
                          <div className="w-4/5 h-0.5 bg-slate-50"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* View Button Reveal on Hover */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-800 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <EditOutlined className="text-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="text-[15px] font-bold text-slate-900 m-0 mb-0.5 truncate group-hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => router.push(`/resumes/${resume.id}`)}
                        >
                          {resume.title || "Untitled Resume"}
                        </h4>
                        <Text className="text-[11px] font-bold uppercase text-slate-400 tracking-wide">
                          {templateConfig?.name || resume.template} Layout
                        </Text>
                      </div>
                      <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                        <Button 
                          type="text" 
                          icon={<MoreOutlined />} 
                          className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 -mr-2 -mt-1 rounded-lg" 
                        />
                      </Dropdown>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      {resume.isPublic ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          <GlobalOutlined className="text-[10px]" /> PUBLIC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          <LockOutlined className="text-[10px]" /> PRIVATE
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                        <CalendarOutlined className="text-[10px]" />
                        {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
