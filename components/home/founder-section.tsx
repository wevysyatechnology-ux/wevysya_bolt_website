'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export function FounderSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent z-10" />
                <Image
                  src="/home/project/.bolt/Media/Founder_Anil.webp"
                  alt="Anil Guptha - Founder of WeVysya"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">
                  From Our Founder
                </span>
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-2 w-12 h-12 text-emerald-500/20" />
                <blockquote className="relative pl-8">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Wevysya was born from a vision to create a global network where ambitious young professionals
                    can connect, grow, and make a lasting impact. Our community is built on the pillars of excellence,
                    innovation, and mutual support.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Every member brings unique perspectives and talents that enrich our collective journey.
                    Together, we're not just building careers—we're shaping the future of leadership.
                  </p>
                </blockquote>
              </div>

              <div className="pt-4">
                <div className="space-y-1">
                  <p className="text-white font-semibold text-xl">Anil Guptha</p>
                  <p className="text-emerald-400 text-sm">Founder, Wevysya</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </section>
  );
}
