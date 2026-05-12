import { ImageResponse } from "next/og";
import { defaultSeoDescription, siteDomain, siteName } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${siteName} professional CV builder`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f6f8fb",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: 610 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
            <div
              style={{
                alignItems: "center",
                background: "#0f172a",
                borderRadius: 16,
                display: "flex",
                height: 72,
                justifyContent: "center",
                position: "relative",
                width: 72,
              }}
            >
              <div
                style={{
                  background: "#1e293b",
                  border: "4px solid #ffffff",
                  height: 42,
                  left: 22,
                  position: "absolute",
                  top: 15,
                  width: 31,
                }}
              />
              <div
                style={{
                  borderBottom: "4px solid #ffffff",
                  borderLeft: "4px solid #ffffff",
                  height: 12,
                  left: 41,
                  position: "absolute",
                  top: 16,
                  width: 12,
                }}
              />
              <div style={{ background: "#38bdf8", borderRadius: 999, height: 8, left: 29, position: "absolute", top: 38, width: 18 }} />
              <div style={{ background: "#ffffff", borderRadius: 999, height: 8, left: 29, position: "absolute", top: 48, width: 13 }} />
              <div style={{ background: "#38bdf8", borderRadius: 999, height: 8, left: 22, position: "absolute", top: 24, width: 8 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 900 }}>{siteName}</div>
              <div style={{ color: "#2563eb", fontSize: 24, fontWeight: 800 }}>{siteDomain}</div>
            </div>
          </div>
          <div style={{ fontSize: 68, fontWeight: 950, letterSpacing: 0, lineHeight: 0.98 }}>
            Build a polished CV online.
          </div>
          <div style={{ color: "#475569", fontSize: 28, lineHeight: 1.35 }}>{defaultSeoDescription}</div>
          <div style={{ display: "flex", gap: 14 }}>
            {["Templates", "LinkedIn import", "PDF export"].map((item) => (
              <div
                key={item}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: 12,
                  color: "#334155",
                  fontSize: 22,
                  fontWeight: 800,
                  padding: "13px 18px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: 18,
            boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
            display: "flex",
            flexDirection: "column",
            height: 470,
            padding: 34,
            width: 360,
          }}
        >
          <div style={{ borderBottom: "1px solid #e2e8f0", display: "flex", gap: 20, paddingBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
              <div style={{ background: "#2563eb", borderRadius: 6, height: 16, width: 118 }} />
              <div style={{ background: "#0f172a", borderRadius: 6, height: 30, width: 220 }} />
              <div style={{ background: "#e2e8f0", borderRadius: 6, height: 12, width: 170 }} />
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 14, height: 68, width: 68 }} />
          </div>
          <div style={{ display: "flex", gap: 22, paddingTop: 28 }}>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 20 }}>
              {[0, 1, 2].map((item) => (
                <div key={item} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ background: "#0f172a", borderRadius: 6, height: 12, width: 90 }} />
                  <div style={{ background: "#e2e8f0", borderRadius: 6, height: 9, width: "100%" }} />
                  <div style={{ background: "#e2e8f0", borderRadius: 6, height: 9, width: "82%" }} />
                </div>
              ))}
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: 14, display: "flex", flexDirection: "column", gap: 12, padding: 18, width: 116 }}>
              <div style={{ background: "#0d9488", borderRadius: 6, height: 12, width: 60 }} />
              <div style={{ background: "#cbd5e1", borderRadius: 6, height: 9, width: "100%" }} />
              <div style={{ background: "#cbd5e1", borderRadius: 6, height: 9, width: "76%" }} />
              <div style={{ background: "#f59e0b", borderRadius: 6, height: 12, marginTop: 16, width: 72 }} />
              <div style={{ background: "#ffffff", borderRadius: 6, height: 22, width: "100%" }} />
              <div style={{ background: "#ffffff", borderRadius: 6, height: 22, width: "88%" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
