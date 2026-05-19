import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteName}`,
  description: `Read the ${siteName} privacy policy for details about account, resume, and contact information handling.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `Privacy Policy | ${siteName}`,
    description: `Read the ${siteName} privacy policy for details about account, resume, and contact information handling.`,
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="m-0 text-sm font-bold uppercase tracking-wide text-blue-600">Privacy Policy</p>
          <h1 className="m-0 mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Privacy Policy for {siteName}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">Last updated: May 19, 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="m-0 text-xl font-black text-slate-900">Information We Collect</h2>
              <p className="m-0 mt-3">
                We collect the information you provide when creating an account, building a resume, importing resume content, or contacting support. This can include your name, email address, resume details, employment history, education, skills, and public CV settings.
              </p>
            </section>

            <section>
              <h2 className="m-0 text-xl font-black text-slate-900">How We Use Information</h2>
              <p className="m-0 mt-3">
                We use this information to provide the resume builder, save your resumes, generate exports, support public CV sharing, respond to messages, improve the product, and protect the service from misuse.
              </p>
            </section>

            <section>
              <h2 className="m-0 text-xl font-black text-slate-900">Public CVs</h2>
              <p className="m-0 mt-3">
                If you publish a CV, the information on that CV can be visible to anyone with the public link and may be indexed by search engines. You can make a CV private from your resume settings.
              </p>
            </section>

            <section>
              <h2 className="m-0 text-xl font-black text-slate-900">Analytics</h2>
              <p className="m-0 mt-3">
                We may use analytics tools to understand site traffic and product usage. These tools help measure page visits, device information, and general interaction patterns.
              </p>
            </section>

            <section>
              <h2 className="m-0 text-xl font-black text-slate-900">Contact</h2>
              <p className="m-0 mt-3">
                For privacy questions, contact support@resumedot.site.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
