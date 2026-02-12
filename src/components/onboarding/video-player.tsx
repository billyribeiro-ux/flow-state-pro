"use client";

import { useCallback, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId: string;
  title: string;
  onProgress?: (percentage: number, currentTime: number) => void;
  onComplete?: () => void;
  initialPosition?: number;
}

export function VideoPlayer({
  playbackId,
  title,
  onProgress,
  onComplete,
  initialPosition = 0,
}: VideoPlayerProps) {
  const [completed, setCompleted] = useState(false);
  const lastReportedRef = useRef(0);

  const handleTimeUpdate = useCallback(
    (event: Event) => {
      const target = event.target as HTMLVideoElement;
      if (!target.duration || target.duration === 0) return;

      const percentage = (target.currentTime / target.duration) * 100;
      const currentTime = target.currentTime;

      // Report progress every 5%
      if (Math.floor(percentage / 5) > Math.floor(lastReportedRef.current / 5)) {
        lastReportedRef.current = percentage;
        onProgress?.(percentage, currentTime);
      }

      // Mark complete at 90%
      if (percentage >= 90 && !completed) {
        setCompleted(true);
        onComplete?.();
      }
    },
    [onProgress, onComplete, completed]
  );

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-black shadow-[var(--shadow-lg)]">
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_title: title,
        }}
        startTime={initialPosition}
        onTimeUpdate={handleTimeUpdate}
        accentColor="var(--color-brand-600)"
        className="aspect-video w-full"
        streamType="on-demand"
      />
      {completed && (
        <div className="flex items-center gap-2 bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8L7 12L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Video complete
        </div>
      )}
    </div>
  );
}
