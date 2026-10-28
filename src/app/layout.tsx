import type { Metadata } from "next";
import { Archivo_Black, Manrope, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";
import { Navigation } from "@/components/layout/(header)/Navigation2";
import { Footer } from "@/components/layout/(Footer)/Footer";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const robotomono = Roboto_Mono({
  variable: "--font-robotomono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const rogta = localFont({
  src: "../../public/fonts/rogta-modern.bold.otf",
  variable: "--font-rogta",
  weight: "700",
  style: "normal",
  display: "swap",
});

const hkg = localFont({
  src: "../../public/fonts/hk-grotesk/WEB/HKGrotesk-BoldLegacy.woff",
  variable: "--font-hkg",
  weight: "100",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.companyName,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${hkg.variable} ${robotomono.variable} ${archivoBlack.variable} ${rogta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="relative min-h-screen bg-foreground text-white transition-colors duration-300">
          <div className="relative z-10">
            <Navigation />
          </div>
          <main>{children}</main>
          <ScrollToTopButton />
          <Footer />
        </div>
      </body>
    </html>
  );
}
