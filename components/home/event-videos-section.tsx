"use client";

import { useState, useEffect } from 'react';
import { VideoSection } from '@/components/video-section';
import { supabase } from '@/lib/supabase';
import type { EventVideo } from '@/lib/supabase';

const fallback: EventVideo[] = [
  { id: '1', title: 'National Conference 2025 Highlights', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 145, order_index: 0, is_active: true },
  { id: '2', title: 'Mumbai Networking Meet - December 2025', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail_url: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 98, order_index: 1, is_active: true },
  { id: '3', title: 'Bangalore Business Summit', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail_url: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 112, order_index: 2, is_active: true },
  { id: '4', title: 'Hyderabad Visitor Day Experience', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnail_url: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 87, order_index: 3, is_active: true },
  { id: '5', title: 'Chennai Trade Fair 2025', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnail_url: 'https://images.pexels.com/photos/2306296/pexels-photo-2306296.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 104, order_index: 4, is_active: true },
  { id: '6', title: 'Delhi Leadership Workshop', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', thumbnail_url: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 92, order_index: 5, is_active: true },
  { id: '7', title: 'Annual Gala Night 2025', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', thumbnail_url: 'https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 156, order_index: 6, is_active: true },
  { id: '8', title: 'Pune Chapter Launch Event', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', thumbnail_url: 'https://images.pexels.com/photos/2774570/pexels-photo-2774570.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 76, order_index: 7, is_active: true },
  { id: '9', title: 'Kolkata Business Mixer', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', thumbnail_url: 'https://images.pexels.com/photos/2747446/pexels-photo-2747446.jpeg?auto=compress&cs=tinysrgb&w=600', duration: 89, order_index: 8, is_active: true },
];

export function EventVideosSection() {
  const [videos, setVideos] = useState<EventVideo[]>(fallback);

  useEffect(() => {
    supabase
      .from('event_videos')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data }) => { if (data && data.length > 0) setVideos(data); });
  }, []);

  return (
    <VideoSection
      title="Event Highlights"
      subtitle="Witness the energy and connections made at our gatherings across the globe"
      videos={videos}
      type="event"
    />
  );
}
