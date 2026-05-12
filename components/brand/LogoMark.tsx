type LogoMarkProps = {
  className?: string;
  dark?: boolean;
};

export function LogoMark({ className = "h-9 w-9", dark = false }: LogoMarkProps) {
  const background = dark ? "#ffffff" : "#0f172a";
  const primary = dark ? "#0f172a" : "#ffffff";
  const accent = dark ? "#2563eb" : "#38bdf8";

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="14" fill={background} />
      <path
        d="M19 14h18.8L48 24.2V50H19V14Z"
        fill={dark ? "#f8fafc" : "#1e293b"}
        stroke={primary}
        strokeWidth="3"
      />
      <path d="M37.5 14.8V25H47.7" stroke={primary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <path d="M25 34.5h14" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      <path d="M25 42h10" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      <circle cx="22" cy="23" r="3.5" fill={accent} />
    </svg>
  );
}

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  subtitle?: string;
  title?: string;
  dark?: boolean;
};

export function BrandLogo({
  className = "",
  markClassName,
  subtitle,
  title = "ResumeDot",
  dark = false,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markClassName} dark={dark} />
      <div className="min-w-0">
        <span className={`block font-black tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>{title}</span>
        {subtitle ? (
          <span className={`hidden text-xs font-medium sm:block ${dark ? "text-slate-300" : "text-slate-500"}`}>
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
