"use client";

import { useState, useEffect } from 'react';
import { VideoSection } from '@/components/video-section';
import { supabase } from '@/lib/supabase';
import type { LeadershipVideo } from '@/lib/supabase';

const fallback: LeadershipVideo[] = [
  { id: '1', name: 'Anil Guptha', role: 'Founder & Global President', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 120, order_index: 0, is_active: true },
  { id: '2', name: 'Rajesh Kumar', role: 'Vice President', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail_url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 95, order_index: 1, is_active: true },
  { id: '3', name: 'Priya Sharma', role: 'Secretary General', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 110, order_index: 2, is_active: true },
  { id: '4', name: 'Venkat Reddy', role: 'Treasurer', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 88, order_index: 3, is_active: true },
  { id: '5', name: 'Srinivas Naidu', role: 'Regional Director - South', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 102, order_index: 4, is_active: true },
  { id: '6', name: 'Lakshmi Chetty', role: 'Regional Director - North', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnail_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 97, order_index: 5, is_active: true },
];

export function LeadershipVideosSection() {
  const [videos, setVideos] = useState<LeadershipVideo[]>(fallback);

  useEffect(() => {
    supabase
      .from('leadership_videos')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data }) => { if (data && data.length > 0) setVideos(data); });
  }, []);

  return (
    <VideoSection
      title="Meet Our Leaders"
      subtitle="Hear directly from the visionaries building the world's strongest Arya Vysya business network"
      videos={videos}
      type="leadership"
    />
  );
}
