import Link from "next/link";
import {
  ArrowRightOutlined,
  FileSearchOutlined,
  HomeOutlined,
  LayoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const quickLinks = [
  {
    href: "/#templates",
    icon: <LayoutOutlined />,
    label: "Browse templates",
    description: "Start from a polished CV layout.",
  },
  {
    href: "/login",
    icon: <LoginOutlined />,
    label: "Open dashboard",
    description: "Continue editing your saved resumes.",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                <FileSearchOutlined />
                404 page not found
              </div>
              <h1 className="m-0 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                This page is not available.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                The link may be outdated, private, or moved. You can return home,
                choose a CV template, or open your dashboard to continue working.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition-colors hover:bg-blue-700"
                >
                  <HomeOutlined />
                  Back to home
                </Link>
                <Link
                  href="/#templates"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950"
                >
                  Choose a template
                  <ArrowRightOutlined />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-6">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <p className="m-0 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Missing route
                    </p>
                    <p className="m-0 mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                      404
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <FileSearchOutlined className="text-xl" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                        {item.icon}
                      </span>
                      <span>
                        <span className="block text-sm font-black text-slate-900">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-500">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
