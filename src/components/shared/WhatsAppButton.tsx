"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const WhatsAppButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  // Your WhatsApp number (include country code without + or 00)
  const whatsappNumber = '94786733516'; // Replace with your actual number
  const message = 'Hello! I would like to discuss a project with you.';

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Show button after a slight delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Only render on mobile devices
  if (!isMobile) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <button
        onClick={handleWhatsAppClick}
        className={`w-full max-w-xs mx-auto font-medium py-3.5 px-6 rounded-xl backdrop-blur-md border flex items-center justify-center gap-3 active:scale-95 transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 text-white shadow-lg shadow-black/20'
            : 'bg-black/5 border-black/10 text-[#0a0a0a] shadow-lg shadow-black/5'
        }`}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 text-[#25D366]"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Text */}
        <span className="text-base">Chat on WhatsApp</span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
