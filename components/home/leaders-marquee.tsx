'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CircleUser as UserCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FIXED_ROLES = [
  'Global President',
  'Past President',
  'President Elect',
  'Council President',
] as const;

type GlobalLeader = {
  id: string;
  role: string;
  name: string;
  image_url: string;
  is_active: boolean;
};

export function LeadersMarquee() {
  const [leaders, setLeaders] = useState<GlobalLeader[]>([]);

  useEffect(() => {
    supabase
      .from('global_leaders')
      .select('*')
      .then(({ data }) => { if (data) setLeaders(data); });
  }, []);

  // Map role → leader data (or empty placeholder)
  const cards = FIXED_ROLES.map(role => {
    const match = leaders.find(l => l.role === role);
    return { role, name: match?.name ?? '', image_url: match?.image_url ?? '', is_active: match?.is_active ?? false };
  });

  return (
    <section className="relative py-20 overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Global Leaders Network
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with influential professionals and visionaries from around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {cards.map((card, i) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border hover:border-emerald-500/50 transition-all duration-300 bg-card">
                {/* Image area — fixed aspect ratio */}
                <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.name || card.role}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950/60 to-black/60">
                      <UserCircle2 className="w-16 h-16 text-emerald-800/60" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Role badge */}
                  <div className="absolute top-3 left-3 right-3">
                    <span className="inline-block text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full backdrop-blur-sm truncate max-w-full">
                      {card.role}
                    </span>
                  </div>

                  {/* Name overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {card.name ? (
                      <h3 className="text-white font-semibold text-base leading-tight">{card.name}</h3>
                    ) : (
                      <p className="text-gray-500 text-sm italic">To be announced</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </section>
  );
}
