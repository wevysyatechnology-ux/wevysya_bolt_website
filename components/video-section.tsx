"use client";

import { motion } from 'framer-motion';
import { VideoCarousel } from './video-carousel';
import type { LeadershipVideo, TestimonialVideo, EventVideo } from '@/lib/supabase';

interface VideoSectionProps {
  title: string;
  subtitle?: string;
  videos: (LeadershipVideo | TestimonialVideo | EventVideo)[];
  type: 'leadership' | 'testimonial' | 'event';
}

export function VideoSection({ title, subtitle, videos, type }: VideoSectionProps) {
  return (
    <section className="py-20 relative bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <VideoCarousel videos={videos as any} type={type} />
        </motion.div>
      </div>

    </section>
  );
}
