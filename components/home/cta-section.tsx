"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-black border-t border-emerald-500/10">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern
            id="cta-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="2" fill="currentColor" className="text-emerald-400" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-8"
          >
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold gradient-text">
              Join Our Community Today
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Ready to Transform Your <span className="gradient-text">Business</span>?
          </h2>
          <p className="text-xl md:text-2xl text-teal-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 2,000+ Arya Vysya entrepreneurs who are growing together.
            Experience the power of "WE" instead of "I".
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 shadow-2xl shadow-teal-500/50 border-0"
              >
                <Link href="/membership">
                  Become a Member <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-10 py-7 rounded-full glass-card border-teal-500/50 hover:border-teal-400 text-teal-200 hover:text-white"
              >
                <Link href="/visitor-registration">Visit as Guest</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
