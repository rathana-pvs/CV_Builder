import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { siteName } from "@/lib/seo";
import { 
  RocketOutlined, 
  ThunderboltOutlined, 
  SmileOutlined,
  TeamOutlined
} from "@ant-design/icons";

export const metadata: Metadata = {
  title: `About Us | ${siteName}`,
  description: `Learn more about ${siteName} and our mission to simplify the professional resume building process.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <Navbar />
      
      <main>
        <section className="bg-white py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                We're on a mission to <span className="text-blue-600">simplify</span> the job hunt.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                ResumeDot was born from a simple observation: building a professional resume shouldn't be a chore. 
                We've combined modern design with intuitive tools to help you stand out.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Our Philosophy
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  We believe that your resume is more than just a list of jobs. It's your personal brand. 
                  That's why we focus on high-fidelity designs, clean typography, and a seamless user experience.
                </p>
                <div className="mt-10 space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <RocketOutlined />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Speed & Efficiency</h3>
                      <p className="mt-2 text-slate-600">Build and export your resume in minutes, not hours.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <ThunderboltOutlined />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Premium Quality</h3>
                      <p className="mt-2 text-slate-600">Our templates are crafted by professional designers.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-12 text-white text-center">
                   <div>
                      <TeamOutlined className="text-6xl mb-6 opacity-50" />
                      <h3 className="text-2xl font-black mb-4">Community Focused</h3>
                      <p className="text-blue-100">Join thousands of job seekers who have successfully landed their dream roles using our tools.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-slate-950 p-8 md:p-16 text-center text-white">
              <SmileOutlined className="text-5xl text-blue-400 mb-6" />
              <h2 className="text-3xl font-black mb-6">Ready to start?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Stop struggling with formatting and start building your future. 
                Our tool is free to use and easy to love.
              </p>
              <a 
                href="/#templates" 
                className="inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Create your CV
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
