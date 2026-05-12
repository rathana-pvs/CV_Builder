import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0f172a",
          borderRadius: 14,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            border: "3px solid #ffffff",
            height: 36,
            left: 18,
            position: "absolute",
            top: 14,
            width: 28,
          }}
        />
        <div
          style={{
            borderBottom: "3px solid #ffffff",
            borderLeft: "3px solid #ffffff",
            height: 10,
            left: 36,
            position: "absolute",
            top: 15,
            transform: "skew(-1deg)",
            width: 10,
          }}
        />
        <div style={{ background: "#38bdf8", borderRadius: 999, height: 7, left: 25, position: "absolute", top: 34, width: 17 }} />
        <div style={{ background: "#ffffff", borderRadius: 999, height: 7, left: 25, position: "absolute", top: 42, width: 12 }} />
        <div style={{ background: "#38bdf8", borderRadius: 999, height: 7, left: 19, position: "absolute", top: 21, width: 7 }} />
      </div>
    ),
    size,
  );
}
