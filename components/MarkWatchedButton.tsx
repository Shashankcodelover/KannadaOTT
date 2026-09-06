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
  const { isWatched, isLiked, markAsWatched, unmarkAsWatched, toggleLike, watchedList } = useWatched();
  const watched = isWatched(movie.id);
  const liked = isLiked(movie.id);
  const watchedItem = watchedList.find((m) => m.id === movie.id);

  const formatRemainingTime = (expiresAt: number) => {
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return 'Cycle ended';
    const totalDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;
    if (years > 0) return `${years}y ${days}d left`;
    return `${days}d left`;
  };

  if (watched) {
    return (
      <div className="flex flex-wrap items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="text-base">✓</span>
          <span>Marked as Watched / Done</span>
        </div>
        <span className="text-zinc-400">
          (2-Year Anti-Repeat Active: {watchedItem ? formatRemainingTime(watchedItem.expiresAt) : '730 days'})
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => toggleLike(movie)}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer border ${
              liked
                ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
            title={liked ? 'In Recollections ❤️' : 'Save to Recollections ❤️'}
          >
            {liked ? '❤️ Liked' : '🤍 Like'}
          </button>

          <button
            onClick={() => unmarkAsWatched(movie.id)}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors font-bold cursor-pointer"
          >
            ↺ Restore to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => markAsWatched(movie, ottName)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-emerald-950/60 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
        title="Mark movie as watched so it will not appear in your discovery feed again for 2 years"
      >
        <span className="text-emerald-400">✓</span>
        <span>Mark as Done (2-Yr Cooldown)</span>
      </button>

      <button
        onClick={() => toggleLike(movie)}
        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:scale-105 ${
          liked
            ? 'bg-rose-950/70 border-rose-600 text-rose-300'
            : 'bg-zinc-900/90 hover:bg-rose-950/40 border-zinc-700 hover:border-rose-500 text-zinc-300 hover:text-rose-300'
        }`}
        title="Keep movie in Recollections collection"
      >
        <span>{liked ? '❤️' : '🤍'}</span>
        <span>{liked ? 'Liked' : 'Recollect'}</span>
      </button>
    </div>
  );
}
