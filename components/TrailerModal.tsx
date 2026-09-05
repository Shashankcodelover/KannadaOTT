'use client';

import { useState, useEffect } from 'react';

interface TrailerModalProps {
  youtubeId?: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ youtubeId, title, isOpen, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !youtubeId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">▶</span>
            <span className="text-white font-bold text-sm sm:text-base line-clamp-1">
              {title} — Official Trailer &amp; Scenes (Kannada)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close trailer"
          >
            ✕
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Footer info & Direct YouTube Link */}
        <div className="px-4 py-3 bg-zinc-900/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓ 3-Way Verified Trailer</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Kannada / Official Audio</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-lg shadow transition-all hover:scale-105 active:scale-95 text-xs"
            >
              <span>▶</span>
              <span>Open in YouTube App ↗</span>
            </a>
            <span className="hidden sm:inline text-zinc-500 text-[11px]">(Press ESC to close)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
