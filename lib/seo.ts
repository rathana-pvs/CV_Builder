export const siteName = "ResumeDot";
export const siteDomain = "resumedot.site";
export const productionSiteUrl = `https://${siteDomain}`;

export const defaultSeoDescription =
  "Build a professional CV online with polished resume templates, LinkedIn import, live preview, public CV sharing, and PDF export.";

export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    productionSiteUrl;

  return url.replace(/\/$/, "");
}

export function getSiteOrigin() {
  return new URL(getSiteUrl());
}
