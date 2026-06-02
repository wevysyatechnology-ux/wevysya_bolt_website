"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';

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
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  return match ? match[1] : null;
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VideoCarousel({ videos, type = 'testimonial' }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset player state on video change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentIndex]);

  // Play / pause sync
  useEffect(() => {
    if (!videoRef.current) return;
    const ytId = getYouTubeId(videos[currentIndex]?.video_url || '');
    if (ytId) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentIndex, videos]);

  // Fullscreen change listener
  useEffect(() => {
    function onFSChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // React does not reactively update the `muted` DOM property via the prop,
  // so we sync it manually whenever isMuted changes.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
  }, []);

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-3xl">
        <p className="text-white/60">No videos available</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const ytId = getYouTubeId(currentVideo.video_url);
  const isDirectVideo = !ytId;
  const hasProgress = isDirectVideo && duration > 0;
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getInfoContent = () => {
    switch (type) {
      case 'leadership':
        return (
          <>
            <motion.h3
              key={`name-${currentVideo.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-1"
            >
              {currentVideo.name}
            </motion.h3>
            <motion.p
              key={`role-${currentVideo.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-400 font-medium"
            >
              {currentVideo.role}
            </motion.p>
          </>
        );
      case 'testimonial':
        return (
          <>
            <motion.h3
              key={`name-${currentVideo.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-white mb-1"
            >
              {currentVideo.member_name}
            </motion.h3>
            {currentVideo.business_name && (
              <motion.p
                key={`biz-${currentVideo.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-emerald-400 font-medium text-sm"
              >
                {currentVideo.business_name}
              </motion.p>
            )}
            {currentVideo.city && (
              <motion.p
                key={`city-${currentVideo.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white/70 text-sm"
              >
                {currentVideo.city}
              </motion.p>
            )}
          </>
        );
      case 'event':
        return (
          <motion.h3
            key={`title-${currentVideo.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-white"
          >
            {currentVideo.title}
          </motion.h3>
        );
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        ref={containerRef}
        className="relative aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {ytId ? (
              isPlaying ? (
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
              )
            ) : (
              <video
                ref={videoRef}
                src={currentVideo.video_url}
                poster={currentVideo.thumbnail_url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Overlay: hidden while YouTube iframe is active ── */}
        {!(ytId && isPlaying) && (
          <>
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />

            {/* Bottom info + controls */}
            <div className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5">
              {/* Progress bar (direct video only) */}
              {hasProgress && (
                <div className="mb-3">
                  <div
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-1.5 hover:h-1.5 transition-all group"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-emerald-400 rounded-full relative"
                      style={{ width: `${progressPct}%` }}
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow -translate-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/70 hover:text-white transition-colors p-1"
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {/* Info text */}
              {getInfoContent()}
            </div>
          </>
        )}

        {/* ── Play / Pause button ── */}
        {/* pointer-events-none on the full-cover div so underlying controls remain clickable */}
        {!(ytId && isPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors pointer-events-auto"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </motion.button>
          </div>
        )}

        {/* Stop button for YouTube iframe */}
        {ytId && isPlaying && (
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

        {/* Mute button (direct video only) */}
        {isDirectVideo && (
          <div className="absolute top-6 right-6 z-30">
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
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-30">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-30">
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
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-30">
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
