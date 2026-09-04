'use client';

import React from 'react';
import { useWatched } from '@/context/WatchedContext';

interface MarkWatchedButtonProps {
  movie: {
    id: number;
    title: string;
    poster_path?: string | null;
  };
  ottName?: string;
}

export default function MarkWatchedButton({ movie, ottName }: MarkWatchedButtonProps) {
  const { isWatched, markAsWatched, unmarkAsWatched, watchedList } = useWatched();
  const watched = isWatched(movie.id);
  const watchedItem = watchedList.find((m) => m.id === movie.id);

  const formatRemainingTime = (expiresAt: number) => {
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return 'Expiring';
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (watched) {
    return (
      <div className="flex flex-wrap items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="text-base">✓</span>
          <span>Marked as Watched / Done</span>
        </div>
        <span className="text-zinc-400">
          (Hidden from feed • In Drafts: {watchedItem ? formatRemainingTime(watchedItem.expiresAt) : '7 days'})
        </span>
        <button
          onClick={() => unmarkAsWatched(movie.id)}
          className="ml-auto px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors font-bold cursor-pointer"
        >
          ↺ Restore to Feed
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => markAsWatched(movie, ottName)}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-emerald-950/60 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
      title="Mark movie as watched so it will not appear in your discovery feed again"
    >
      <span className="text-emerald-400">✓</span>
      <span>Mark as Done / Watched</span>
      <span className="text-zinc-500 font-normal text-xs">(Hide from feed)</span>
    </button>
  );
}
