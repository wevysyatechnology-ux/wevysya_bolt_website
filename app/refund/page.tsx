"use client";

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';

export default function RefundPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="default" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-4">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Refund Policy
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-emerald-800/30 bg-gradient-to-br from-[#0d2b1e]/60 to-[#0a1f16]/60 p-6 md:p-8 space-y-6"
          >
            <p className="text-gray-300 text-sm leading-relaxed">
              Our goal is to maintain the lowest membership fee possible in an effort to ensure that all individuals can afford the opportunity to be a part of WeVysya.
            </p>
            <div className="border-t border-emerald-800/20 pt-6">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wide mb-3">
                Refund Eligibility
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                In case of the death of a member within one month of membership, no refund is applicable for any members.
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center text-xs text-gray-600"
          >
            For any questions regarding this policy, please contact us at{' '}
            <a href="mailto:reachus@wevysya.com" className="text-emerald-500 hover:text-emerald-400 transition-colors">
              reachus@wevysya.com
            </a>
          </motion.p>
        </div>
      </section>
    </div>
  );
}
