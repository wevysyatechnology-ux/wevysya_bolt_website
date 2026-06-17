import { HeroSection } from '@/components/home/hero-section';
import { WhySection } from '@/components/home/why-section';
import { CtaSection } from '@/components/home/cta-section';
import { LeadershipVideosSection } from '@/components/home/leadership-videos-section';
import { TestimonialVideosSection } from '@/components/home/testimonial-videos-section';
import { EventVideosSection } from '@/components/home/event-videos-section';
import { FounderSection } from '@/components/home/founder-section';
import { LeadersMarquee } from '@/components/home/leaders-marquee';

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />
      <FounderSection />
      <LeadersMarquee />
      <TestimonialVideosSection />
      <WhySection />
      <LeadershipVideosSection />
      <EventVideosSection />
      <CtaSection />
    </div>
  );
}
