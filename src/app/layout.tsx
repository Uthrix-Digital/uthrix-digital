import type { Metadata, Viewport } from "next";
import { Archivo_Black, Manrope, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";
import { Navigation } from "@/components/layout/(header)/Navigation";
import { Footer } from "@/components/layout/(Footer)/Footer";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";
import Intro from "@/components/shared/(IntoAnimation)/Intro";
import IntroController from "@/components/shared/(IntoAnimation)/IntroController";
import ScrollToTopOnLoad from "@/components/shared/ScrollToTopOnLoad";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { PageTransition } from "@/components/shared/PageTransition";
import { ConsentProvider } from "@/components/shared/(CookieConsent)/ConsentProvider";
import { CookieBanner } from "@/components/shared/(CookieConsent)/CookieBanner";
import { MetaPixel } from "@/components/shared/(CookieConsent)/MetaPixel";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/shared/JsonLd";
import { themeInitScript } from "@/lib/theme";
import { googleConsentInitScript } from "@/lib/consent";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "800"],
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

/**
 * Site-wide defaults. Pages override title, description and canonical.
 * The share image comes from app/opengraph-image.tsx and applies to every
 * route that doesn't supply its own.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.companyName,
  description: siteConfig.description,
  applicationName: siteConfig.companyName,
  publisher: siteConfig.companyName,
  openGraph: {
    type: "website",
    siteName: siteConfig.companyName,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${hkg.variable} ${robotomono.variable} ${archivoBlack.variable} ${rogta.variable} h-full antialiased`}
    >
      <head>
        {/* Sets data-theme before first paint: no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {siteConfig.gtmId && (
          <>
            {/* Consent Mode defaults must run before gtm.js: everything starts
                "denied" until the visitor accepts on the cookie banner. */}
            <script dangerouslySetInnerHTML={{ __html: googleConsentInitScript }} />
            <script
              async
              src={`https://www.googletagmanager.com/gtm.js?id=${siteConfig.gtmId}`}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ThemeProvider>
          <ConsentProvider>
            <MetaPixel />
            <CookieBanner />
            <Intro />
            <IntroController />
            <ScrollToTopOnLoad />
            <PageTransition />
            <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
              {/* z-50 keeps the fixed header above page content that uses its own
                  z-index (cards, overlays). Only the cookie banner, intro and page
                  transition sit higher; popovers tie and win by DOM order. */}
              <div className="relative z-50">
                <Navigation />
              </div>
              <main>{children}</main>
              <ScrollToTopButton />
              <div className="relative z-0">
                <Footer />
              </div>
            </div>
          </ConsentProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
