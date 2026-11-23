import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/siteConfig";

/**
 * Default share image for every route (link previews in chat apps, social
 * posts and AI answer cards). A route can override it with its own
 * opengraph-image file. Twitter falls back to og:image.
 */
export const alt = `${siteConfig.companyName}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_RED = "#c40202";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em" }}>
          {siteConfig.companyName}
          <span style={{ color: BRAND_RED }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
            Web development · Digital marketing · Growth strategy
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: BRAND_RED }} />
      </div>
    ),
    size,
  );
}
