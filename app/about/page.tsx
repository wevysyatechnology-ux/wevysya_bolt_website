"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, TrendingUp, Users } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { LeadershipVideosSection } from '@/components/home/leadership-videos-section';
import { supabase } from '@/lib/supabase';
import type { LeadershipTeamMember } from '@/lib/supabase';

const TEAM_SECTIONS = [
  'Global Executive Board',
  'Governing Council',
  'Global Advisory Board',
  'Global Support Team',
  'State Team',
  'Zonal Team',
] as const;

const FALLBACK_LEADERSHIP: LeadershipTeamMember[] = [
  { id: '1', name: 'Anil Guptha',          designation: 'Founder',                    bio: 'Visionary entrepreneur with 14+ years of experience in the water filtration business.', photo_url: '', team_section: 'Governing Council', order_index: 0, is_active: true },
  { id: '2', name: 'Mahendra Chimakurthi', designation: 'Global President',            bio: 'Entrepreneur with two decades of experience across the USA and India.',                   photo_url: '', team_section: 'Governing Council', order_index: 1, is_active: true },
  { id: '3', name: 'Dr Suvarna Kumar',     designation: 'Governing Council President', bio: 'Professor with two decades of experience bridging academia and entrepreneurship.',          photo_url: '', team_section: 'Governing Council', order_index: 2, is_active: true },
  { id: '4', name: 'Santosh Setty',        designation: 'Global President Elect',      bio: 'Ex-banker carrying two decades of rich financial and business experience.',                  photo_url: '', team_section: 'Governing Council', order_index: 3, is_active: true },
];

const values = [
  { icon: Users,      title: 'Community First',  description: 'We believe in the power of collective growth over individual success.' },
  { icon: Target,     title: 'Trust & Integrity', description: 'Building relationships based on transparency and ethical business practices.' },
  { icon: TrendingUp, title: 'Mutual Growth',     description: 'Creating opportunities that benefit all members of our community.' },
  { icon: Eye,        title: 'Long-term Vision',  description: 'Focusing on sustainable business relationships that last generations.' },
];

function MemberCard({ leader, index }: { leader: LeadershipTeamMember; index: number }) {
  return (
    <motion.div
      key={leader.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <Card className="h-full text-center hover:shadow-xl hover:shadow-teal-500/10 transition-all">
        <CardContent className="p-6">
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {leader.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leader.photo_url}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {leader.name.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>
          <h3 className="font-semibold text-lg mb-1">{leader.name}</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">{leader.designation}</p>
          {leader.bio && <p className="text-sm text-muted-foreground">{leader.bio}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AboutPage() {
  const [allMembers, setAllMembers] = useState<LeadershipTeamMember[]>(FALLBACK_LEADERSHIP);
  const [activeSection, setActiveSection] = useState<string>(TEAM_SECTIONS[0]);

  useEffect(() => {
    supabase
      .from('leadership_team')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) setAllMembers(data);
      });
  }, []);

  const visibleSections = TEAM_SECTIONS.filter(
    s => allMembers.some(m => m.team_section === s)
  );

  const membersInSection = allMembers.filter(m => m.team_section === activeSection);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="default" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About WeVysya</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              WeVysya is the world&apos;s premier Arya Vysya Entrepreneurs Grid,
              connecting business owners and entrepreneurs globally. We believe in
              the power of community, collaboration, and shared success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="h-full hover:shadow-2xl hover:shadow-teal-500/20 transition-all">
                <CardContent className="p-8">
                  <motion.div
                    className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a global ecosystem where Arya Vysya entrepreneurs
                    thrive through meaningful connections, knowledge sharing, and
                    collaborative business growth. We transform &quot;I&quot; thinking into
                    &quot;WE&quot; thinking.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="h-full hover:shadow-2xl hover:shadow-teal-500/20 transition-all">
                <CardContent className="p-8">
                  <motion.div
                    className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: -5, scale: 1.1 }}
                  >
                    <Eye className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the most trusted and impactful business community for
                    Arya Vysya entrepreneurs worldwide, facilitating billions in
                    business value and creating lasting legacies for future
                    generations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="h-full text-center hover:shadow-xl hover:shadow-teal-500/10 transition-all">
                      <CardContent className="p-6">
                        <motion.div
                          className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Leadership Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Leadership Team</h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              The dedicated individuals who drive WeVysya&apos;s vision forward
            </p>

            {/* Section tabs */}
            {visibleSections.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {visibleSections.map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                      ${activeSection === section
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/25'
                        : 'text-muted-foreground border-white/10 hover:border-emerald-500/40 hover:text-white'
                      }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {membersInSection.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-12">
                    No members in this section yet.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {membersInSection.map((leader, index) => (
                      <MemberCard key={leader.id} leader={leader} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="bg-black">
        <LeadershipVideosSection />
      </section>
    </div>
  );
}
