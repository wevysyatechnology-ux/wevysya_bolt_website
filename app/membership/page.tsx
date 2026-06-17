"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ChevronDown } from 'lucide-react';
import { MembershipApplicationForm } from '@/components/membership/application-form';
import { AnimatedBackground } from '@/components/animated-background';
import { supabase } from '@/lib/supabase';

type Faq = {
  id: string;
  question: string;
  answer: string;
  order_index: number;
};

const regularFeatures = [
  { text: 'Access to bi-weekly networking meetings', included: true },
  { text: 'Business link exchange opportunities', included: true },
  { text: 'Connect with 2,000+ members', included: true },
  { text: 'Attend national events (MANAM)', included: true },
  { text: 'Member directory access', included: true },
  { text: 'Online community platform', included: true },
  { text: 'Personalized micro-site', included: false },
  { text: 'Exclusive privileged events', included: false },
  { text: 'Preferred seating at events', included: false },
  { text: 'Investment opportunities access', included: false },
  { text: 'No renewal required', included: false },
];

export default function MembershipPage() {
  const [showForm, setShowForm] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('membership_faqs')
      .select('id, question, answer, order_index')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data, error }) => { if (!error && data) setFaqs(data); });
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="default" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join WeVysya Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start growing your business with the Arya Vysya community
            </p>
          </motion.div>

          {/* Membership Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <Card className="overflow-hidden border border-emerald-800/40 bg-gradient-to-br from-[#0d2b1e] to-[#0a1f16]">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Pricing Info */}
                <div className="lg:w-2/5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-emerald-800/30 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-4">
                      Regular Membership
                    </span>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-white">&#8377;10,620</span>
                    </div>
                    <p className="text-emerald-300/70 text-sm mb-6">per year &mdash; Perfect for growing businesses</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Join India&apos;s most trusted Arya Vysya business network. Gain access to exclusive networking events, business links, and a community of 2,000+ entrepreneurs.
                    </p>
                  </div>
                  <Button
                    className="mt-8 w-full bg-white text-black hover:bg-emerald-50 font-semibold text-base py-6 rounded-xl transition-all duration-200"
                    onClick={() => setShowForm(true)}
                  >
                    Choose Regular Membership
                  </Button>
                </div>

                {/* Right: Features Grid */}
                <div className="lg:w-3/5 p-8 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-6">What&apos;s included</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {regularFeatures.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </span>
                        ) : (
                          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                            <X className="h-3 w-3 text-gray-500" />
                          </span>
                        )}
                        <span className={feature.included ? 'text-gray-200 text-sm' : 'text-gray-500 text-sm'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Application Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Membership Application</CardTitle>
                  <CardDescription>
                    Please fill in your details. Your application will be reviewed and
                    you&apos;ll be notified within 2-3 business days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MembershipApplicationForm selectedPlan="regular" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* FAQs Section */}
          {faqs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Everything you need to know about WeVysya membership</p>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border border-border rounded-xl overflow-hidden bg-card"
                  >
                    <button
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      aria-expanded={openFaq === faq.id}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === faq.id && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div id={`faq-answer-${faq.id}`} className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed border-t border-border">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
