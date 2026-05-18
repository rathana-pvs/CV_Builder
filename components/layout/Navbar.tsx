"use client";

import { Button } from "antd";
import { BrandLogo } from "@/components/brand/LogoMark";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { siteName } from "@/lib/seo";

interface NavbarProps {
  disabled?: boolean;
}

export function Navbar({ disabled }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleLogoClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-80"
          disabled={disabled}
          onClick={handleLogoClick}
        >
          <BrandLogo
            markClassName="h-9 w-9 drop-shadow-sm"
            subtitle="Professional resume studio"
            title={siteName}
          />
        </button>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link 
            href="/#templates" 
            className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900"
          >
            Templates
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-bold transition-colors hover:text-slate-900 ${pathname === "/about" ? "text-slate-950" : "text-slate-600"}`}
          >
            About
          </Link>
          <Link 
            href="/#contact" 
            className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="text"
            className="font-semibold text-slate-600"
            disabled={disabled}
            onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
          <Button
            type="primary"
            className="rounded-lg border-none bg-slate-950 px-4 font-bold shadow-sm hover:!bg-slate-800"
            disabled={disabled}
            onClick={() => router.push("/login")}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </nav>
  );
}
