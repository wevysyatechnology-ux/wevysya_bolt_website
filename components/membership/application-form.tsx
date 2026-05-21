"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  business_name: z.string().min(2, 'Business name is required'),
  business_category: z.string().min(2, 'Business category is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  why_join: z.string().min(50, 'Please provide at least 50 characters'),
  is_arya_vysya: z.boolean().refine((val) => val === true, {
    message: 'You must be from Arya Vysya community',
  }),
  no_criminal_background: z.boolean().refine((val) => val === true, {
    message: 'You must confirm no criminal background',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function MembershipApplicationForm({
  selectedPlan,
}: {
  selectedPlan: 'regular';
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      business_name: '',
      business_category: '',
      city: '',
      state: '',
      why_join: '',
      is_arya_vysya: false,
      no_criminal_background: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('membership_applications').insert([
        {
          ...values,
          membership_type: selectedPlan,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Application Submitted!',
        description:
          'Thank you for applying. We will review your application and get back to you within 2-3 business days.',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
                  <Input type="email" placeholder="your@email.com" {...field} />
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
                  <Input placeholder="+91 98765 43210" {...field} />
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
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="business_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Manufacturing, IT, Retail, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Your state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="why_join"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join WeVysya?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your business goals and how you expect WeVysya to help you grow..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Minimum 50 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 bg-muted p-4 rounded-lg">
          <FormField
            control={form.control}
            name="is_arya_vysya"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I confirm that I am from the Arya Vysya community
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="no_criminal_background"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I declare that I have no criminal background
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Your membership is subject to approval by the
            WeVysya leadership team. You will be notified via email within 2-3
            business days.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
