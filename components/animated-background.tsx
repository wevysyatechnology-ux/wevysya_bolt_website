"use client";

import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'minimal';
}

export function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const getBlobs = () => {
    switch (variant) {
      case 'hero':
        return (
          <>
            <motion.div
              className="absolute top-10 left-10 w-[500px] h-[500px] bg-teal-600/30 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] blur-3xl"
              animate={{
                borderRadius: [
                  '40% 60% 70% 30% / 60% 30% 70% 40%',
                  '60% 40% 30% 70% / 30% 60% 40% 70%',
                  '40% 60% 70% 30% / 60% 30% 70% 40%',
                ],
                x: [0, 30, 0],
                y: [0, 50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-emerald-600/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl"
              animate={{
                borderRadius: [
                  '60% 40% 30% 70% / 60% 30% 70% 40%',
                  '40% 60% 70% 30% / 30% 60% 40% 70%',
                  '60% 40% 30% 70% / 60% 30% 70% 40%',
                ],
                x: [0, -20, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        );

      case 'minimal':
        return (
          <>
            <motion.div
              className="absolute top-10 right-10 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-teal-600/20 rounded-[50%_50%_30%_70%/60%_40%_60%_40%] blur-3xl"
              animate={{
                borderRadius: [
                  '50% 50% 30% 70% / 60% 40% 60% 40%',
                  '30% 70% 70% 30% / 40% 60% 40% 60%',
                  '50% 50% 30% 70% / 60% 40% 60% 40%',
                ],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        );

      default:
        return (
          <>
            <motion.div
              className="absolute top-20 left-10 w-[450px] h-[450px] bg-teal-600/25 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] blur-3xl"
              animate={{
                borderRadius: [
                  '40% 60% 70% 30% / 60% 30% 70% 40%',
                  '60% 40% 30% 70% / 30% 60% 40% 70%',
                  '40% 60% 70% 30% / 60% 30% 70% 40%',
                ],
                x: [0, 25, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-emerald-600/25 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                x: [0, -25, 0],
                y: [0, 25, 0],
              }}
              transition={{
                duration: 23,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {getBlobs()}
    </div>
  );
}
