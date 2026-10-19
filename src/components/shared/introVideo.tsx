"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroVideo() {
  // null = not decided yet (avoids flash and hydration mismatch)
  const [show, setShow] = useState<boolean | null>(null);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Decide on the client whether to show the intro (once per browser session)
  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");
    setShow(!seen);
  }, []);

  // Lock page scroll while the intro is visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [show]);

  const finish = () => {
    sessionStorage.setItem("introSeen", "1");
    setFading(true);
    setTimeout(() => setShow(false), 600); // match the transition duration
  };

  // Don't render anything until we know, or once it's done
  if (show === null || show === false) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish} // if the video fails, never block the site
        className="h-full w-full object-contain md:object-cover"
      />
      <button
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/30"
      >
        Skip
      </button>
    </div>
  );
}