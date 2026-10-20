"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress for the circular progress indicator
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Calculate circle circumference for progress indicator
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 group"
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
                className="text-gray-300 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
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
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
              />
            </svg>
            
            {/* Center button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-300">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#141414] dark:bg-white text-white dark:text-[#0a0a0a] text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Back to top
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-[#141414] dark:bg-white"></div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
