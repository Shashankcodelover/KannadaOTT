'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWatched, TrackedMovie } from '@/context/WatchedContext';
import { getPosterUrl } from '@/lib/tmdb';

export default function WatchedDraftsModal() {
  const {
    watchedList,
    likedList,
    deletedList,
    isDraftsOpen,
    setDraftsOpen,
    restoreMovie,
    toggleLike,
    clearAllWatched,
    clearAllDeleted,
    hideWatched,
    setHideWatched,
  } = useWatched();

  const [activeTab, setActiveTab] = useState<'watched' | 'liked' | 'deleted'>('watched');

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDraftsOpen(false);
    };
    if (isDraftsOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDraftsOpen, setDraftsOpen]);

  if (!isDraftsOpen) return null;

  const formatRemainingTime = (expiresAt: number) => {
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return 'Cycle ended';
    const totalDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;
    if (years > 0) return `${years}y ${days}d left`;
    return `${days}d left`;
  };

  const currentList: TrackedMovie[] =
    activeTab === 'watched'
      ? watchedList
      : activeTab === 'liked'
      ? likedList
      : deletedList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛡️</span>
            <div>
              <h2 className="text-white font-black text-base sm:text-lg">
                2-Year Anti-Repeat Registry & Recollections
              </h2>
              <p className="text-zinc-400 text-xs">
                730-day tracking bandwidth • Avoids repeating visited & purged films on refresh or rerun
              </p>
            </div>
          </div>

          <button
            onClick={() => setDraftsOpen(false)}
            className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-zinc-900/70 border-b border-zinc-800 flex items-center gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('watched')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'watched'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>✓ Watched & Done</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
              {watchedList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'liked'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>❤️ Liked / Recollections</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
              {likedList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deleted')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'deleted'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🚫 Purged & Excluded</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
              {deletedList.length}
            </span>
          </button>
        </div>

        {/* Controls Strip */}
        <div className="px-5 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideWatched}
              onChange={(e) => setHideWatched(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-400 h-4 w-4"
            />
            <span className="text-zinc-300 font-medium">
              Hide tracked movies from discovery rows ({hideWatched ? 'Active' : 'Disabled'})
            </span>
          </label>

          <div className="flex items-center gap-2">
            {activeTab === 'watched' && watchedList.length > 0 && (
              <button
                onClick={clearAllWatched}
                className="text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 transition-colors cursor-pointer text-[11px]"
              >
                Clear Watched
              </button>
            )}
            {activeTab === 'deleted' && deletedList.length > 12 && (
              <button
                onClick={clearAllDeleted}
                className="text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 transition-colors cursor-pointer text-[11px]"
              >
                Reset Custom Dismissed
              </button>
            )}
          </div>
        </div>

        {/* Body List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {currentList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl">
                {activeTab === 'watched' ? '🍿' : activeTab === 'liked' ? '❤️' : '🚫'}
              </span>
              <p className="text-zinc-300 font-bold text-sm">
                {activeTab === 'watched'
                  ? 'No watched movies in cooldown'
                  : activeTab === 'liked'
                  ? 'No movies marked as Liked yet'
                  : 'No custom purged movies'}
              </p>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                {activeTab === 'watched'
                  ? 'When you watch or mark a film as Done, it is locked into this 2-year anti-repeat cycle so you only discover new titles.'
                  : activeTab === 'liked'
                  ? 'Click the ❤️ icon on any movie card to save it into your Recollections collection so you can revisit it anytime.'
                  : 'Historical biopics and old-style stories are permanently barred from repeat discovery.'}
              </p>
            </div>
          ) : (
            currentList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-16 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image
                      src={getPosterUrl(item.poster_path || null, 'small')}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/movie/${item.id}`}
                      onClick={() => setDraftsOpen(false)}
                      className="text-white font-bold text-sm hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      {item.status === 'watched' && (
                        <span className="text-emerald-400 font-semibold">✓ Done</span>
                      )}
                      {item.status === 'deleted' && (
                        <span className="text-amber-400 font-semibold">🚫 Purged</span>
                      )}
                      {item.status === 'dismissed' && (
                        <span className="text-orange-400 font-semibold">✕ Dismissed</span>
                      )}
                      {item.isLiked && (
                        <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                          ❤️ Liked (In Recollections)
                        </span>
                      )}
                      {item.ottName && <span>• via {item.ottName}</span>}
                      {item.reason && <span className="italic text-zinc-500">• {item.reason}</span>}
                      <span>•</span>
                      <span className="text-amber-400/90 font-mono text-[11px]">
                        ⏱️ {formatRemainingTime(item.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle Like */}
                  <button
                    onClick={() => toggleLike(item)}
                    className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      item.isLiked
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                    }`}
                    title={item.isLiked ? 'Remove from Recollections' : 'Keep in Recollections ❤️'}
                  >
                    {item.isLiked ? '❤️ Liked' : '🤍 Like'}
                  </button>

                  {/* Restore to Feed */}
                  <button
                    onClick={() => restoreMovie(item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Restore movie back to discovery feed"
                  >
                    ↺ Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Policy */}
        <div className="px-5 py-3 bg-zinc-900/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span>
            🛡️ <strong>2-Year Cooldown Cycle:</strong> Tracked films will not be pushed again upon feed refresh or sync rerun.
          </span>
          <button
            onClick={() => setDraftsOpen(false)}
            className="text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

