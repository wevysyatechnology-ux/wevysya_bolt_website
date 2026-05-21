"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoItem {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  subtitle?: string;
  name?: string;
  role?: string;
  member_name?: string;
  business_name?: string;
  city?: string;
}

interface VideoCarouselProps {
  videos: VideoItem[];
  type?: 'leadership' | 'testimonial' | 'event';
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  return match ? match[1] : null;
}

export function VideoCarousel({ videos, type = 'testimonial' }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const ytId = getYouTubeId(videos[currentIndex]?.video_url || '');
      if (ytId) return;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex, videos]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-3xl">
        <p className="text-white/60">No videos available</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  const getOverlayContent = () => {
    switch (type) {
      case 'leadership':
        return (
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-1"
            >
              {currentVideo.name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-400 font-medium"
            >
              {currentVideo.role}
            </motion.p>
          </div>
        );
      case 'testimonial':
        return (
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-white mb-1"
            >
              {currentVideo.member_name}
            </motion.h3>
            {currentVideo.business_name && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-emerald-400 font-medium text-sm"
              >
                {currentVideo.business_name}
              </motion.p>
            )}
            {currentVideo.city && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white/70 text-sm"
              >
                {currentVideo.city}
              </motion.p>
            )}
          </div>
        );
      case 'event':
        return (
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-white"
            >
              {currentVideo.title}
            </motion.h3>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {(() => {
              const ytId = getYouTubeId(currentVideo.video_url);
              if (ytId) {
                return isPlaying ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    title={currentVideo.title || 'Video'}
                  />
                ) : (
                  <img
                    src={currentVideo.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                    alt={currentVideo.title || 'Video thumbnail'}
                    className="w-full h-full object-cover"
                  />
                );
              }
              return (
                <video
                  ref={videoRef}
                  src={currentVideo.video_url}
                  poster={currentVideo.thumbnail_url}
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                />
              );
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Gradient + title overlay — hidden when YouTube iframe is active so it doesn't block controls */}
        {!(getYouTubeId(currentVideo.video_url) && isPlaying) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />
            {getOverlayContent()}
          </>
        )}

        {/* Play button — shown when not playing; for native video also shows Pause */}
        {!(getYouTubeId(currentVideo.video_url) && isPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </motion.button>
          </div>
        )}

        {/* Stop button shown over YouTube iframe so user can exit back to thumbnail */}
        {getYouTubeId(currentVideo.video_url) && isPlaying && (
          <div className="absolute top-4 right-4 z-30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(false)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        )}

        {!getYouTubeId(currentVideo.video_url) && (
          <div className="absolute top-6 right-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
            </motion.button>
          </div>
        )}

        {videos.length > 1 && (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </>
        )}

        {videos.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPlaying(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-emerald-400'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
