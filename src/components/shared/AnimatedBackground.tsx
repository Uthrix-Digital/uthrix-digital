"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #D1001F 1px, transparent 1px),
            linear-gradient(to bottom, #D1001F 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }} />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-[120px] bg-primary/10"
        animate={{
          x: mousePosition.x * 100 - 50,
          y: mousePosition.y * 100 - 50,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        style={{ top: '20%', left: '10%' }}
      />
      
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-[120px] bg-blue-500/10"
        animate={{
          x: -mousePosition.x * 80 + 40,
          y: -mousePosition.y * 80 + 40,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 30 }}
        style={{ bottom: '20%', right: '10%' }}
      />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(209,0,31,0.15) 0%, transparent 70%)',
          top: '10%',
          right: '5%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
