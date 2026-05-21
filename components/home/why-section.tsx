"use client";

import { motion } from 'framer-motion';
import { Handshake, TrendingUp, Users, Award, Globe, Zap } from 'lucide-react';

const benefits = [
  {
    icon: Handshake,
    title: 'Trusted Network',
    description:
      'Connect with verified Arya Vysya entrepreneurs who share your values and business ethics.',
  },
  {
    icon: TrendingUp,
    title: 'Business Growth',
    description:
      'Access to ₹540+ crores in closed deals and countless opportunities for collaboration.',
  },
  {
    icon: Users,
    title: 'Bi-weekly Meetings',
    description:
      'Regular networking sessions every 15 days to exchange business links and build relationships.',
  },
  {
    icon: Award,
    title: 'Exclusive Events',
    description:
      'Annual national events like MANAM, workshops, and privileged member gatherings.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Connect with members across 19+ countries including USA, UAE, Australia, and more.',
  },
  {
    icon: Zap,
    title: 'Fast Results',
    description:
      'Members report significant business growth within the first 6 months of joining.',
  },
];

export function WhySection() {
  return (
    <section className="py-32 bg-black relative overflow-hidden border-y border-emerald-500/10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Join <span className="gradient-text">WeVysya</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of a united entrepreneurial community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="glass-card rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 border border-white/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
