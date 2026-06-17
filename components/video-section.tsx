"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoCarousel } from './video-carousel';
import type { LeadershipVideo, TestimonialVideo, EventVideo } from '@/lib/supabase';

interface VideoSectionProps {
  title: string;
  subtitle?: string;
  videos: (LeadershipVideo | TestimonialVideo | EventVideo)[];
  type: 'leadership' | 'testimonial' | 'event';
}

const DESKTOP_PER_PAGE = 4;

export function VideoSection({ title, subtitle, videos, type }: VideoSectionProps) {
  const [desktopStart, setDesktopStart] = useState(0);

  const canPrev = desktopStart > 0;
  const canNext = desktopStart + DESKTOP_PER_PAGE < videos.length;

  const visibleVideos = videos.slice(desktopStart, desktopStart + DESKTOP_PER_PAGE);

  const handlePrev = () => setDesktopStart((p) => Math.max(0, p - 1));
  const handleNext = () => setDesktopStart((p) => Math.min(videos.length - DESKTOP_PER_PAGE, p + 1));

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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {/* ── Desktop: 4 cards + section-level arrows ── */}
        <div className="hidden md:block">
          <div className="relative px-14">
            <div className="grid grid-cols-4 gap-4">
              {visibleVideos.map((video) => (
                <motion.div
                  key={'id' in video ? video.id : String(desktopStart)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <VideoCarousel
                    videos={[video] as any}
                    type={type}
                    instanceId={'id' in video ? video.id : String(desktopStart)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Prev arrow */}
            {canPrev && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg"
                aria-label="Previous videos"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next arrow */}
            {canNext && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg"
                aria-label="Next videos"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Dot indicators for desktop */}
          {videos.length > DESKTOP_PER_PAGE && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(videos.length / DESKTOP_PER_PAGE) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopStart(i * DESKTOP_PER_PAGE)}
                  className={`h-1.5 rounded-full transition-all ${
                    Math.floor(desktopStart / DESKTOP_PER_PAGE) === i
                      ? 'w-8 bg-emerald-400'
                      : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile: single carousel (arrows inside carousel) ── */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <VideoCarousel videos={videos as any} type={type} instanceId={`mobile-${type}`} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
