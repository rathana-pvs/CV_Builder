import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { defaultSeoDescription, getSiteOrigin, getSiteUrl, siteDomain, siteName } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  applicationName: siteName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  title: {
    default: "Free Online CV Builder With Templates and PDF Export",
    template: `%s | ${siteName}`,
  },
  description: defaultSeoDescription,
  keywords: [
    "CV builder",
    "resume builder",
    "professional CV templates",
    "LinkedIn resume import",
    "PDF resume export",
    "online resume maker",
    "free CV builder",
    "public CV website",
  ],
  authors: [{ name: siteName, url: getSiteUrl() }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: "Free Online CV Builder With Templates and PDF Export",
    description: defaultSeoDescription,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteName} professional CV builder`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online CV Builder With Templates and PDF Export",
    description: defaultSeoDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  category: "technology",
  other: {
    "og:domain": siteDomain,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        </Suspense>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
