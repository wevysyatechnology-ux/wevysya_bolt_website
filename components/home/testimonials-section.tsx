"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { supabase, type Testimonial } from '@/lib/supabase';
import { Star, Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (data) {
        setTestimonials(data);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <section className="py-32 bg-black relative overflow-hidden border-y border-emerald-500/10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/40 rounded-full blur-3xl" />
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
            Success Stories from <span className="gradient-text">Our Members</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real testimonials from entrepreneurs who transformed their businesses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full p-2"
                  >
                    <Card className="h-full glass-card border-white/10 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-start mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                            <Quote className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <p className="text-lg mb-8 line-clamp-4 leading-relaxed">
                          {testimonial.content}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div>
                            <div className="font-bold text-lg gradient-text">
                              {testimonial.member_name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {testimonial.member_business}
                            </div>
                          </div>
                          {testimonial.rating && (
                            <div className="flex gap-1">
                              {Array.from({ length: testimonial.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-5 w-5 fill-teal-500 text-teal-500"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex hover:bg-teal-500/20" />
            <CarouselNext className="hidden md:flex hover:bg-teal-500/20" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
