"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayContextValue {
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
}

const VideoPlayContext = createContext<VideoPlayContextValue>({
  playingId: null,
  setPlayingId: () => {},
});

export function VideoPlayProvider({ children }: { children: ReactNode }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  return (
    <VideoPlayContext.Provider value={{ playingId, setPlayingId }}>
      {children}
    </VideoPlayContext.Provider>
  );
}

export function useVideoPlay() {
  return useContext(VideoPlayContext);
}
