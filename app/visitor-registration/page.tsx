"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Loader as Loader2, UserPlus } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  business_name: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  preferred_date: z.string().min(1, 'Please select a preferred date'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VisitorRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      business_name: '',
      city: '',
      preferred_date: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('visitor_registrations').insert([
        {
          ...values,
          preferred_date: new Date(values.preferred_date).toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Registration Successful!',
        description:
          'Thank you for registering. We will contact you shortly to confirm your visit.',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="minimal" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Attend as a Visitor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of WeVysya firsthand. Register for a visitor
              day and see how our community can transform your business.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Meet Members</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with successful entrepreneurs in your industry
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Networking Session</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience our bi-weekly business networking meetings
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">No Obligation</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit without any commitment, decide if it's right for you
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Registration Form</CardTitle>
                  <CardDescription>
                    Fill in your details and we'll arrange a visit to one of our
                    upcoming meetings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 98861 28128" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="business_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferred_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Visit Date</FormLabel>
                              <FormControl>
                                <Input type="date" min={minDate} {...field} />
                              </FormControl>
                              <FormDescription>
                                Choose your preferred date
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>What to expect:</strong> You'll receive a
                          confirmation email within 24 hours with details about the
                          meeting location, time, and what to bring. Our team will
                          guide you through the entire experience.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Register for Visitor Day
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
