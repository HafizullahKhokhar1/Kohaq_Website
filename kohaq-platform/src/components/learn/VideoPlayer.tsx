"use client";

import { motion } from "framer-motion";
import { useVideoProgress } from "@/hooks/useVideoProgress";

function formatSeconds(value: number) {
  const total = Math.max(0, Math.floor(value));
  const min = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const sec = (total % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

export function VideoPlayer({
  courseSlug,
  lessonId,
  youtubeVideoId,
  initialWatchedSeconds,
  initialTotalSeconds,
}: {
  courseSlug: string;
  lessonId: string;
  youtubeVideoId: string;
  initialWatchedSeconds?: number;
  initialTotalSeconds?: number;
}) {
  const { mountRef, isReady, isPlaying, watchedSeconds, totalSeconds, watchPercentage, isCompleted } = useVideoProgress({
    courseSlug,
    lessonId,
    youtubeVideoId,
    initialWatchedSeconds,
    initialTotalSeconds,
  });

  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="aspect-video overflow-hidden rounded-lg border border-border bg-[#111]">
        <div ref={mountRef} className="h-full w-full" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">
          {isReady ? (isPlaying ? "Playing" : "Paused") : "Loading player..."}
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">
          {formatSeconds(watchedSeconds)} / {formatSeconds(totalSeconds)}
        </span>
        {!isCompleted ? (
          <span
            className="inline-flex h-7 w-7 rounded-full border border-border"
            style={{
              background: `conic-gradient(var(--color-accent) ${Math.max(1, Math.min(100, watchPercentage))}%, transparent 0)`,
            }}
            title={`${Math.round(watchPercentage)}% watched`}
          />
        ) : (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-[#0d1b2a]"
            title="Lesson completed"
          >
            ✓
          </motion.span>
        )}
        <p className="text-sm text-text-muted">Completion unlocks at 90% watched.</p>
      </div>
    </section>
  );
}

