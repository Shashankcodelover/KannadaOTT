'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWatched } from '@/context/WatchedContext';
import { getPosterUrl } from '@/lib/tmdb';

export default function WatchedDraftsModal() {
  const {
    watchedList,
    isDraftsOpen,
    setDraftsOpen,
    unmarkAsWatched,
    clearAllWatched,
    hideWatched,
    setHideWatched,
  } = useWatched();

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
    if (remainingMs <= 0) return 'Expiring now';
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <div>
              <h2 className="text-white font-black text-base sm:text-lg">
                Watched / Visited Movies (Drafts)
              </h2>
              <p className="text-zinc-400 text-xs">
                {watchedList.length} movie{watchedList.length === 1 ? '' : 's'} hidden from feed • Auto-deleted after 7 days
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

        {/* Controls Strip */}
        <div className="px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideWatched}
              onChange={(e) => setHideWatched(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-400 h-4 w-4"
            />
            <span className="text-zinc-300 font-medium">
              Hide watched movies from discovery rows ({hideWatched ? 'Active' : 'Disabled'})
            </span>
          </label>

          {watchedList.length > 0 && (
            <button
              onClick={clearAllWatched}
              className="text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              Clear All Drafts
            </button>
          )}
        </div>

        {/* Body List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {watchedList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl">🍿</span>
              <p className="text-zinc-300 font-bold text-sm">No watched movies yet</p>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                When you click &quot;Watch on OTT&quot; or mark a film as Done, it moves here and is hidden from your feed so you always discover fresh movies!
              </p>
            </div>
          ) : (
            watchedList.map((item) => (
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
                      <span className="text-emerald-400 font-semibold">✓ Done / Watched</span>
                      {item.ottName && (
                        <span>• via {item.ottName}</span>
                      )}
                      <span>•</span>
                      <span className="text-amber-400/90 font-mono">
                        ⏱️ {formatRemainingTime(item.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => unmarkAsWatched(item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Restore movie back to discovery feed"
                  >
                    ↺ Restore to Feed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Policy */}
        <div className="px-5 py-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>ℹ️ Movies in Drafts are automatically purged after 7 days.</span>
          <button
            onClick={() => setDraftsOpen(false)}
            className="text-white font-bold hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
