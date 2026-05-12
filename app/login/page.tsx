import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-4 md:p-6">
      {/* Rich background decoration */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1100px] flex bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 rounded-3xl overflow-hidden min-h-[650px]">
        {/* Left Content / Branding */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
                CV
              </div>
              <span className="font-black text-xl tracking-tight">CV Online</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-6 text-white">
              Unlock your <br/> 
              professional future.
            </h1>
            <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">
              Build recruiter-approved resumes with dynamic layouts, real-time previews, and instant exports.
            </p>
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <p className="text-slate-200 italic mb-4 font-medium">
                "The most intuitive resume builder I've ever used. Got my new job in under 2 weeks!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md flex items-center justify-center font-bold text-sm">JD</div>
                <div>
                  <div className="font-bold text-sm">James D.</div>
                  <div className="text-xs text-slate-400 font-medium">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content / Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
