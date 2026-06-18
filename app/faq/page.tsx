"use client";

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimatedBackground } from '@/components/animated-background';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is WeVysya?",
    answer:
      "WeVysya is a network of Arya Vysya business owners who help each other in our community to succeed. We bring together entrepreneurs, professionals, and business leaders from the Arya Vysya community to collaborate, grow, and thrive together.",
  },
  {
    question: "Why should I join WeVysya?",
    answer:
      "By joining WeVysya, you gain access to valuable links, advice, resources, exclusive events, training & development programs, community advocacy, and opportunities for grants & funding. It is a platform designed to accelerate your business growth through the strength of our community.",
  },
  {
    question: "What happens after joining?",
    answer:
      "WeVysya organizes regular meetings where our members can interact and network with each other. You will be connected to your local House chapter, receive invitations to events, and get access to our member resources and support systems.",
  },
  {
    question: "Will I surely get business after joining?",
    answer:
      "Business outcomes depend on active participation, the products and services you offer, and the relationships you build within the network. We do not guarantee any business, but we provide the platform and opportunities to help you grow.",
  },
  {
    question: "Should I attend meetings regularly? Will I lose my membership if I miss?",
    answer:
      "Regular attendance is highly encouraged as it is key to building meaningful connections within the community. Membership may be affected if attendance consistently falls below the requirements set in our attendance policy. We recommend staying active to get the most out of your membership.",
  },
  {
    question: "What is the validity of membership?",
    answer:
      "Membership is valid for 1 year from the date of registration. You can renew your membership annually to continue enjoying all the benefits WeVysya has to offer.",
  },
  {
    question: "Will I get financial support from WeVysya?",
    answer:
      "WeVysya does not directly provide financial support, but we help connect members with Angel investors, VCs, and Banks who can assist with funding and investment opportunities for your business.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, there are no hidden charges. You only pay the registration fee and the annual membership fee. Everything is transparent and communicated upfront at the time of joining.",
  },
  {
    question: "What is the eligibility criteria to join WeVysya?",
    answer:
      "Any Arya Vysya entrepreneur who runs a business independently and has no criminal background is eligible to join WeVysya. We welcome business owners across all industries and sectors.",
  },
  {
    question: "If I can't attend a meeting, can someone attend on my behalf?",
    answer:
      "Yes, as per our substitution policy, a replacement is allowed when a member cannot attend a meeting. This ensures your business continues to be represented even when you are unavailable.",
  },
  {
    question: "Do we have regular meetings?",
    answer:
      "Yes, every House chapter holds regular meetings once every 15 days. These meetings are the core of our networking activity, giving members consistent opportunities to connect, share, and grow together.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about WeVysya — membership, meetings, benefits, and more.
          </p>
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section className="pb-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-white/10 rounded-2xl px-6 bg-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold py-5 hover:no-underline hover:text-emerald-400 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
