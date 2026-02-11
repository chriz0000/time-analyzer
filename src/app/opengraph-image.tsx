import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "New Age Longevity — Time Analyzer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public", "logo.jpg"));
  const logoBase64 = `data:image/jpeg;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F0F0F",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          width={140}
          height={140}
          style={{ marginBottom: 32 }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#00E5A0",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          New Age Longevity
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#FAFAFA",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          Your Personalized Longevity Protocol
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 22,
            color: "#999999",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Free. Science-backed. Takes 2 minutes.
        </div>
      </div>
    ),
    { ...size }
  );
}
