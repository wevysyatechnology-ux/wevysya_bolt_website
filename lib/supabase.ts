import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  business_name?: string;
  business_category?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  bio?: string;
  photo_url?: string;
  membership_type?: 'regular' | 'privileged';
  membership_status?: 'pending' | 'active' | 'expired';
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  event_type: 'meeting' | 'national' | 'visitor_day';
  start_date: string;
  end_date?: string;
  location?: string;
  city?: string;
  max_attendees?: number;
  image_url?: string;
  created_at?: string;
};

export type Testimonial = {
  id: string;
  member_name: string;
  member_business?: string;
  member_photo_url?: string;
  content: string;
  rating?: number;
  featured?: boolean;
  created_at?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  category?: 'success_story' | 'business_tip' | 'recipe' | 'podcast' | 'blog';
  image_url?: string;
  published?: boolean;
  published_at?: string;
  created_at?: string;
};

export type LeadershipVideo = {
  id: string;
  name: string;
  role: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
};

export type TestimonialVideo = {
  id: string;
  member_name: string;
  business_name?: string;
  city?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
};

export type EventVideo = {
  id: string;
  title: string;
  event_id?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
};
