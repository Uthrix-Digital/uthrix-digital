import Image from "next/image";
import Link from "next/link";

const COPYRIGHT_YEAR = 2026;

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "#contact" },
];

const capabilityLinks = [
  { label: "Social Media Marketing", href: "#services" },
  { label: "Website Development", href: "#services" },
  { label: "Software Development", href: "#services" },
  { label: "AI Automation", href: "#services" },
  { label: "SEO", href: "#services" },
  { label: "UI/UX Designing", href: "#services" },
  { label: "Visual Brand Identity Design", href: "#services" },
  { label: "Package Design", href: "#services" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block transition-colors hover:text-black focus-visible:text-black"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 bg-white text-black">
      <div className="layout-container">
        <div className="grid gap-12 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(150px,0.7fr)_minmax(260px,1fr)_minmax(150px,0.7fr)] lg:gap-10 lg:py-28">
          <div className="max-w-md">
            <Link href="/" aria-label="Uthrix Digital home" className="inline-block">
              <Image
                src="/assets/logo.svg"
                alt="Uthrix Digital"
                width={333}
                height={84}
                className="h-auto w-56 sm:w-72 lg:w-84"
              />
            </Link>
            <p className="mt-7 max-w-108 text-base leading-7 tracking-[-0.02em] text-black/85 sm:text-lg sm:leading-7">
              Thoughtful strategy, design and digital marketing. A clearer
              direction for your business.
            </p>
            <p className="mt-6 text-base leading-6 text-black/85">
              Contact details to be added
            </p>
          </div>

          <nav aria-label="Company">
            <h2 className="text-base font-medium leading-6">Company</h2>
            <ul className="mt-3 space-y-2 text-base leading-6 text-black/85">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav aria-label="Capabilities">
            <h2 className="text-base font-medium leading-6">Capabilities</h2>
            <ul className="mt-3 space-y-2 text-base leading-6 text-black/85">
              {capabilityLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sri Lanka office">
            <h2 className="text-base font-medium leading-6">Sri Lanka</h2>
            <ul className="mt-3 space-y-2 text-base leading-6 text-black/85">
              <FooterLink href="#services">Brand strategy</FooterLink>
              <FooterLink href="#services">Website design</FooterLink>
              <li>
                <a
                  href="tel:+94728282122"
                  className="inline-block transition-colors hover:text-black focus-visible:text-black"
                >
                  Ph: +94 72 82 82 122
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-5 border-t border-black/70 py-6 text-base leading-6 text-black/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {COPYRIGHT_YEAR} Uthrix Digital</p>
          <div className="flex gap-7">
            <Link href="/privacy" className="transition-colors hover:text-black">
              Privacy policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-black">
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
