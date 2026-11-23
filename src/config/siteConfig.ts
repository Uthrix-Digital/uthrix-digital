export const siteConfig = {
  companyName: "Uthrix Digital",
  /** Production origin. Used to resolve canonical and other metadata URLs. */
  url: "https://uthrix.com",
  tagline: "Digital Excellence Engineered for Growth.",
  description: "We blend cutting-edge web & software development with data-driven digital marketing to accelerate your business growth and market dominance.",
  whatsappNumber: "+9494728282122",
  whatsappLink: "https://wa.me/94728282122",
  email: "info@uthrix.com",
  /** Meta Pixel ID. Public by nature (sent to every visitor's browser). Empty string disables the Pixel. */
  metaPixelId: "2194372151424643",
  /** Google Tag Manager container ID. Public by nature. Empty string disables GTM. */
  gtmId: "GTM-MSSHF24G",
  /** Where the business is based. Used in Organization structured data. */
  country: "LK",
  /** Logo used in structured data and link previews (path under /public). */
  logoPath: "/assets/Images/logoBlack.svg",
  /**
   * Official profiles. Clean, canonical URLs only (no tracking or share
   * parameters): they also feed Organization `sameAs`, which AI engines and
   * search engines use to confirm these profiles belong to us.
   * "#" marks a profile that doesn't exist yet; it's hidden everywhere.
   */
  socials: {
    linkedin: "https://www.linkedin.com/company/uthrix/",
    facebook: "https://www.facebook.com/profile.php?id=61581276571721",
    instagram: "https://www.instagram.com/uthrix_digital/",
    tiktok: "#",
  },
};

/** Social profile URLs that exist (placeholders removed). */
export const socialProfiles = Object.values(siteConfig.socials).filter(
  (href) => href !== "#",
);
