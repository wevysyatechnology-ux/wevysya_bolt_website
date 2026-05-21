"use client";

import { useState, useEffect } from 'react';
import { VideoSection } from '@/components/video-section';
import { supabase } from '@/lib/supabase';
import type { TestimonialVideo } from '@/lib/supabase';

const fallback: TestimonialVideo[] = [
  { id: '1', member_name: 'Venkat Reddy', business_name: 'Reddy Textiles Pvt Ltd', city: 'Hyderabad', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 75, order_index: 0, is_active: true },
  { id: '2', member_name: 'Srinivas Chetty', business_name: 'Chetty Enterprises', city: 'Chennai', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 82, order_index: 1, is_active: true },
  { id: '3', member_name: 'Lakshmi Naidu', business_name: 'Naidu Tech Solutions', city: 'Bangalore', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 68, order_index: 2, is_active: true },
  { id: '4', member_name: 'Krishna Murthy', business_name: 'KM Logistics', city: 'Mumbai', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 91, order_index: 3, is_active: true },
  { id: '5', member_name: 'Ravi Chowdary', business_name: 'Chowdary Foods & Beverages', city: 'Delhi', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 79, order_index: 4, is_active: true },
  { id: '6', member_name: 'Anjali Setty', business_name: 'Setty Jewelers', city: 'Pune', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 86, order_index: 5, is_active: true },
  { id: '7', member_name: 'Ramesh Goud', business_name: 'Goud Construction', city: 'Vijayawada', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 73, order_index: 6, is_active: true },
  { id: '8', member_name: 'Suresh Balija', business_name: 'Balija Agro Industries', city: 'Guntur', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail_url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 88, order_index: 7, is_active: true },
  { id: '9', member_name: 'Madhavi Komati', business_name: 'Komati Fashion Boutique', city: 'Visakhapatnam', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 71, order_index: 8, is_active: true },
];

export function TestimonialVideosSection() {
  const [videos, setVideos] = useState<TestimonialVideo[]>(fallback);

  useEffect(() => {
    supabase
      .from('testimonial_videos')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data }) => { if (data && data.length > 0) setVideos(data); });
  }, []);

  return (
    <VideoSection
      title="Success Stories"
      subtitle="Real entrepreneurs sharing how WeVysya transformed their business journey"
      videos={videos}
      type="testimonial"
    />
  );
}
