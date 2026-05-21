"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', text: 'text-lg' },
    md: { container: 'w-16 h-16', text: 'text-2xl' },
    lg: { container: 'w-24 h-24', text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <motion.div
        className={`${sizes[size].container} relative flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Image
          src="/wevysya-logo.png"
          alt="WeVysya Logo"
          width={96}
          height={96}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>
      {showText && (
        <motion.div
          className={`font-bold ${sizes[size].text} text-white`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          WeVysya
        </motion.div>
      )}
    </div>
  );
}
