import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import IntroAnimation from "@/components/shared/IntroAnimation"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uthrix Digital",
  description: "Uthrix Digital — creative digital experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Cinematic logo intro — overlays the full viewport on first visit */}
        <IntroAnimation />
        {children}
      </body>
    </html>
  );
}
