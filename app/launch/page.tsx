"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ── Fireworks canvas engine ──────────────────────────────────────────────────

const BRAND_COLORS = [
  '#34D399', '#10B981', '#6EE7B7', // emerald
  '#F59E0B', '#FCD34D', '#FBBF24', // amber / gold
  '#FFFFFF', '#E2E8F0',             // white
  '#38BDF8', '#7DD3FC',             // sky
];

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; decay: number;
  radius: number; color: string;
  trail: { x: number; y: number }[];
};

type Shell = {
  x: number; y: number;
  vy: number; color: string;
  fuseTime: number; elapsed: number;
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawnBurst(
  x: number, y: number,
  particles: Particle[],
  count = 80,
) {
  const color1 = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
  const color2 = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomBetween(-0.1, 0.1);
    const speed = randomBetween(2, 9);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: randomBetween(0.012, 0.022),
      radius: randomBetween(2, 4.5),
      color: Math.random() > 0.5 ? color1 : color2,
      trail: [],
    });
  }
  // sparkle ring
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(0.5, 3);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      alpha: 1,
      decay: randomBetween(0.018, 0.03),
      radius: randomBetween(1, 2.5),
      color: '#FFFFFF',
      trail: [],
    });
  }
}

// ── Component ────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'countdown' | 'fireworks' | 'done';

export default function LaunchPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<Shell[]>([]);
  const burstScheduleRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(10);

  // ── Fireworks loop ───────────────────────────────────────────────────────
  const startFireworks = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Resize canvas to fill window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Schedule a wave of bursts
    const schedule = (delay: number, fn: () => void) => {
      burstScheduleRef.current.push(setTimeout(fn, delay));
    };

    const W = canvas.width;
    const H = canvas.height;

    const burst = (x: number, y: number, n = 90) =>
      spawnBurst(x, y, particlesRef.current, n);

    // Immediate big center burst
    burst(W / 2, H * 0.4, 120);
    burst(W * 0.3, H * 0.45, 80);
    burst(W * 0.7, H * 0.45, 80);

    schedule(300, () => {
      burst(W * 0.5, H * 0.35, 100);
      burst(W * 0.2, H * 0.55, 70);
      burst(W * 0.8, H * 0.55, 70);
    });
    schedule(600, () => {
      burst(W * 0.4, H * 0.3, 90);
      burst(W * 0.6, H * 0.3, 90);
      burst(W * 0.5, H * 0.6, 80);
    });
    schedule(900, () => {
      burst(W * 0.25, H * 0.38, 80);
      burst(W * 0.75, H * 0.38, 80);
      burst(W * 0.5, H * 0.5, 120);
    });
    schedule(1200, () => {
      burst(W * 0.15, H * 0.5, 70);
      burst(W * 0.85, H * 0.5, 70);
      burst(W * 0.5, H * 0.28, 100);
    });
    schedule(1500, () => {
      burst(W * 0.35, H * 0.55, 80);
      burst(W * 0.65, H * 0.55, 80);
      burst(W * 0.5, H * 0.4, 120);
    });

    // Navigate after fireworks settle
    schedule(2800, () => {
      setPhase('done');
      router.push('/');
    });

    // Animation loop
    function loop() {
      ctx.fillStyle = 'rgba(2, 8, 6, 0.18)';
      ctx.fillRect(0, 0, W, H);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          // Draw trail
          for (let t = 0; t < p.trail.length; t++) {
            const trailAlpha = (p.alpha * t) / p.trail.length * 0.4;
            ctx.beginPath();
            ctx.arc(p.trail[t].x, p.trail[t].y, p.radius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = trailAlpha;
            ctx.fill();
          }
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          alive.push(p);
        }
      }
      particlesRef.current = alive;
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [router]);

  // ── Countdown ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;

    let current = 10;
    setCount(10);

    const tick = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearInterval(tick);
        setPhase('fireworks');
        startFireworks();
      } else {
        setCount(current);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [phase, startFireworks]);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      burstScheduleRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleLaunch = () => {
    if (phase !== 'idle') return;
    setPhase('countdown');
  };

  const isFireworks = phase === 'fireworks' || phase === 'done';
  const isCountdown = phase === 'countdown';

  return (
    <div className="fixed inset-0 bg-[#020806] overflow-hidden flex flex-col items-center justify-center select-none">

      {/* Static star field */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.85 ? 2 : 1,
              height: Math.random() > 0.85 ? 2 : 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Fireworks canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 10, opacity: isFireworks ? 1 : 0, transition: 'opacity 0.3s' }}
      />

      {/* Radial glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700, height: 700,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">

        {/* Logo */}
        <AnimatePresence>
          {!isCountdown && !isFireworks && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <Image
                src="/wevysya-logo.png"
                alt="WeVysya"
                width={100}
                height={100}
                className="mx-auto mb-6 drop-shadow-[0_0_24px_rgba(52,211,153,0.4)]"
                priority
              />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-3">
                WeVysya
              </h1>
              <p className="text-emerald-400 text-lg md:text-xl font-medium tracking-widest uppercase mb-2">
                Arya Vysya Entrepreneurs Grid
              </p>
              <p className="text-gray-500 text-sm tracking-wider">
                Physical presence across South India &middot; Virtual presence across the world
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown number */}
        <AnimatePresence mode="wait">
          {isCountdown && (
            <motion.div
              key="countdown-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <p className="text-emerald-400/70 text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
                Launching in
              </p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ scale: 0.3, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.8, opacity: 0, y: -60 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-bold text-white"
                  style={{
                    fontSize: 'clamp(120px, 30vw, 220px)',
                    lineHeight: 1,
                    textShadow: '0 0 60px rgba(52,211,153,0.5), 0 0 120px rgba(52,211,153,0.25)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fireworks caption */}
        <AnimatePresence>
          {isFireworks && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <motion.p
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl md:text-7xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 40px rgba(52,211,153,0.8), 0 0 80px rgba(52,211,153,0.4)' }}
              >
                New Website is Live!
              </motion.p>
              <p className="text-emerald-400 text-lg tracking-widest uppercase font-semibold">
                Together we rise
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats strip (idle only) */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mb-12 mt-2"
            >
              {[
                { value: '27+', label: 'Houses' },
                { value: '2,000+', label: 'Memberships' },
                { value: '3,83,422+', label: 'Links Generated' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-emerald-400/70 tracking-wider uppercase mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launch button */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLaunch}
              className="relative group px-16 py-6 rounded-2xl font-bold text-xl text-black overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
                boxShadow: '0 0 40px rgba(52,211,153,0.5), 0 0 80px rgba(52,211,153,0.2)',
              }}
            >
              {/* shimmer */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
              <span className="relative flex items-center gap-3">
                <span>Launch New Website</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
