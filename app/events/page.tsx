"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Calendar, X } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { EventVideosSection } from '@/components/home/event-videos-section';

type UpcomingEvent = {
  id: string;
  title: string;
  event_date: string;
  image_url: string;
  description: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    year: d.toLocaleDateString('en-IN', { year: 'numeric' }),
    weekday: d.toLocaleDateString('en-IN', { weekday: 'long' }),
    full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function EventModal({ event, onClose }: { event: UpcomingEvent; onClose: () => void }) {
  const date = formatDate(event.event_date);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close event details"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image — 3:4 ratio, capped height */}
          <div className="relative w-full shrink-0 bg-muted overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '55vh' }}>
            {event.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <Calendar className="w-20 h-20 text-emerald-500/30" />
              </div>
            )}

            {/* Date badge */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/10">
              <p className="text-3xl font-extrabold text-white leading-none">{date.day}</p>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-wide mt-0.5">{date.month}</p>
              <p className="text-xs text-muted-foreground">{date.year}</p>
            </div>

            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{date.weekday}, {date.full}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground leading-tight">{event.title}</h2>
            {event.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UpcomingEvent | null>(null);

  useEffect(() => {
    supabase
      .from('upcoming_events')
      .select('id, title, event_date, image_url, description')
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString().slice(0, 10))
      .order('order_index', { ascending: true })
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-black">
      <section className="relative py-20 overflow-hidden">
        <AnimatedBackground variant="minimal" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Upcoming Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our networking meetings, national gatherings, and visitor days
              to grow your business network
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {events.map((event, index) => {
                const date = formatDate(event.event_date);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => setSelected(event)}
                    className="group rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image — 3:4 portrait ratio */}
                    <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '3/4' }}>
                      {event.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                          <Calendar className="w-16 h-16 text-emerald-500/30" />
                        </div>
                      )}

                      {/* Date badge overlay */}
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[52px] border border-white/10">
                        <p className="text-2xl font-extrabold text-white leading-none">{date.day}</p>
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mt-0.5">{date.month}</p>
                        <p className="text-xs text-muted-foreground">{date.year}</p>
                      </div>

                      {/* Gradient overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    {/* Text content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{date.weekday}, {date.full}</span>
                      </div>
                      <h3 className="font-bold text-foreground leading-snug line-clamp-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}

      <section className="bg-black">
        <EventVideosSection />
      </section>
    </div>
  );
}
