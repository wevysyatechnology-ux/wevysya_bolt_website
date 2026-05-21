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

        <div className="relative px-4">
          <div className={`flex gap-8 pb-8 snap-x snap-mandatory scrollbar-hide ${
            videos.length < 4
              ? 'justify-center flex-wrap'
              : 'overflow-x-auto'
          }`}>
            {videos.map((video, index) => (
              <motion.div
                key={'id' in video ? video.id : index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 snap-start w-[340px]"
              >
                <VideoCarousel videos={[video]} type={type} />
              </motion.div>
            ))}
          </div>

          {videos.length >= 4 && (
            <>
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10" />
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
