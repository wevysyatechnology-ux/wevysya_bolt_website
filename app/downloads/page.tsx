"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Download } from '@/lib/supabase';
import { AnimatedBackground } from '@/components/animated-background';
import { FileAudio, FileVideo, FileImage, FileText, Download as DownloadIcon, Search, X } from 'lucide-react';

function typeIcon(type: string) {
  switch (type) {
    case 'audio': return <FileAudio className="w-7 h-7" />;
    case 'video': return <FileVideo className="w-7 h-7" />;
    case 'image': return <FileImage className="w-7 h-7" />;
    default: return <FileText className="w-7 h-7" />;
  }
}

function AudioPreviewBanner() {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 flex items-center justify-center overflow-hidden">
      {/* Animated waveform bars */}
      <div className="absolute inset-0 flex items-end justify-center gap-1.5 pb-8 opacity-30">
        {Array.from({ length: 28 }).map((_, i) => {
          const heights = [40, 70, 30, 90, 55, 100, 35, 80, 60, 45, 95, 50, 75, 38, 85, 65, 42, 92, 48, 78, 58, 33, 88, 52, 72, 47, 82, 62];
          const h = heights[i % heights.length];
          return (
            <motion.span
              key={i}
              className="w-1.5 bg-white/40 rounded-full"
              animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }}
              transition={{
                duration: 1.2 + (i % 5) * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.04,
              }}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
      {/* Glow ring */}
      <div className="absolute w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl" />
      {/* Icon badge */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
        <FileAudio className="w-10 h-10 text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function DocumentPreviewBanner() {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 flex items-center justify-center overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Paper stack effect */}
      <div className="absolute w-20 h-24 rounded-lg bg-white/10 border border-white/20 rotate-[-8deg] translate-x-[-14px] translate-y-[4px]" />
      <div className="absolute w-20 h-24 rounded-lg bg-white/15 border border-white/25 rotate-[3deg] translate-x-[14px] translate-y-[-4px]" />
      {/* Icon badge */}
      <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
        <FileText className="w-10 h-10 text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<Download | null>(null);

  useEffect(() => {
    supabase
      .from('downloads')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setDownloads(data as Download[]);
        setLoading(false);
      });
  }, []);

  const filtered = downloads.filter(d => {
    if (filter !== 'all' && d.file_type !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: downloads.length,
    audio: downloads.filter(d => d.file_type === 'audio').length,
    video: downloads.filter(d => d.file_type === 'video').length,
    image: downloads.filter(d => d.file_type === 'image').length,
    document: downloads.filter(d => d.file_type === 'document').length,
  };

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'audio', label: 'Audio' },
    { key: 'video', label: 'Video' },
    { key: 'image', label: 'Images' },
    { key: 'document', label: 'Documents' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-black">
      <section className="relative py-20 overflow-hidden">
        <AnimatedBackground variant="minimal" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Downloads</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse and download audio recordings, videos, images, and documents
            </p>
          </motion.div>

          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-10 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-emerald-500 text-black'
                      : 'bg-card/60 backdrop-blur-sm border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-black/60' : 'text-muted-foreground/60'}`}>
                    {counts[tab.key as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <DownloadIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-xl">{search || filter !== 'all' ? 'No downloads match your search.' : 'No downloads available yet. Check back soon!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Preview area */}
                  <div className="relative h-44 overflow-hidden">
                    {item.file_type === 'image' && item.file_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.file_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : item.file_type === 'video' && item.file_url ? (
                      <video src={item.file_url} className="w-full h-full object-cover" muted preload="metadata" />
                    ) : item.file_type === 'audio' ? (
                      <AudioPreviewBanner />
                    ) : item.file_type === 'document' ? (
                      <DocumentPreviewBanner />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-900/40">
                        {typeIcon(item.file_type)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/40">
                        {item.file_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3">
                      {item.file_size ? (
                        <span className="text-xs text-muted-foreground">{formatSize(item.file_size)}</span>
                      ) : <span />}
                      <div className="flex gap-2">
                        {(item.file_type === 'audio' || item.file_type === 'video' || item.file_type === 'image') && (
                          <button
                            onClick={() => setPreview(item)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-all"
                          >
                            Preview
                          </button>
                        )}
                        <a
                          href={item.file_url}
                          download={item.file_name || item.title}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all inline-flex items-center gap-1.5"
                        >
                          <DownloadIcon className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="max-w-3xl w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">{preview.title}</h3>
            {preview.file_type === 'audio' && (
              <audio src={preview.file_url} controls className="w-full" autoPlay />
            )}
            {preview.file_type === 'video' && (
              <video src={preview.file_url} controls autoPlay className="w-full max-h-[70vh] rounded-xl" />
            )}
            {preview.file_type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.file_url} alt={preview.title} className="w-full max-h-[70vh] object-contain rounded-xl" />
            )}
            {preview.description && (
              <p className="text-muted-foreground text-sm mt-4 text-center max-w-xl mx-auto">{preview.description}</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
