import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingClient } from "@/components/LandingClient";
import { defaultSeoDescription, getSiteUrl, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Online CV Builder With Templates and PDF Export",
  description: defaultSeoDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Online CV Builder With Templates and PDF Export",
    description: defaultSeoDescription,
    url: "/",
  },
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        name: siteName,
        url: getSiteUrl(),
        description: defaultSeoDescription,
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${getSiteUrl()}/#organization`,
        name: siteName,
        url: getSiteUrl(),
        logo: `${getSiteUrl()}/icon.svg`,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${getSiteUrl()}/#software`,
        name: siteName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: getSiteUrl(),
        description: defaultSeoDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Professional CV templates",
          "LinkedIn import",
          "Live resume preview",
          "Public CV sharing",
          "PDF export",
          "Guest resume creation",
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingClient />
    </>
  );
}
