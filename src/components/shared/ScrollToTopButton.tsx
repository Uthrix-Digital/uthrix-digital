"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);

      // Calculate scroll progress for the circular progress indicator
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate circle circumference for progress indicator
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    // Always rendered; shown and hidden with CSS transitions (no animation
    // library). While hidden it is out of the tab order and the a11y tree.
    <button
      type="button"
      onClick={scrollToTop}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`group fixed bottom-20 right-4 z-50 transition-[opacity,scale,translate,visibility] duration-300 hover:scale-110 active:scale-90 md:bottom-8 md:right-8 ${
        isVisible
          ? "visible translate-y-0 scale-100 opacity-100"
          : "invisible pointer-events-none translate-y-5 scale-50 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      {/* Background circle with gradient */}
      <div className="relative w-14 h-14">
        {/* Progress ring background */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-foreground/15"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300"
          />
        </svg>

        {/* Center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-300">
            <div className="bob">
              <ArrowUp className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Back to top
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-foreground"></div>
      </div>
    </button>
  );
}
