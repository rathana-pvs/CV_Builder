import { BrandLogo } from "@/components/brand/LogoMark";
import { 
  GithubOutlined, 
  TwitterOutlined, 
  LinkedinOutlined,
  FacebookOutlined,
  MailOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import { siteName } from "@/lib/seo";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <BrandLogo
              markClassName="h-8 w-8"
              title={siteName}
              subtitle="Professional resume studio"
            />
            <p className="max-w-xs text-sm leading-6 text-slate-600">
              Building professional, submission-ready resumes in minutes. Designed for modern job seekers.
            </p>
            <div className="flex gap-5 text-slate-400">
              <a href="#" className="transition-colors hover:text-slate-900">
                <TwitterOutlined className="text-xl" />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61589819906598" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900">
                <FacebookOutlined className="text-xl" />
              </a>
              <a href="#" className="transition-colors hover:text-slate-900">
                <GithubOutlined className="text-xl" />
              </a>
              <a href="#" className="transition-colors hover:text-slate-900">
                <LinkedinOutlined className="text-xl" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Product</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link href="/#templates" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="/#features" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link href="/about" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Support</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <MailOutlined className="text-slate-400" />
                    support@resumedot.site
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <GlobalOutlined className="text-slate-400" />
                    Global Support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
