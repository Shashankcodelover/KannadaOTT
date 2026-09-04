'use client';

import { useState } from 'react';
import TrailerModal from './TrailerModal';

interface WatchTrailerButtonProps {
  youtubeId?: string;
  title: string;
  variant?: 'primary' | 'secondary' | 'compact';
  label?: string;
}

export default function WatchTrailerButton({
  youtubeId,
  title,
  variant = 'primary',
  label = 'Watch Trailer',
}: WatchTrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!youtubeId) return null;

  const baseClasses =
    'inline-flex items-center gap-2 font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hover:scale-105 active:scale-95 cursor-pointer';

  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white px-5 py-3 text-sm sm:text-base shadow-lg shadow-red-600/30',
    secondary: 'bg-zinc-800/90 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2.5 text-sm',
    compact: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 px-3 py-1.5 text-xs',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${baseClasses} ${variantClasses[variant]}`}
        aria-label={`Watch ${title} trailer`}
      >
        <svg className="w-5 h-5 text-current" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>{label}</span>
      </button>

      <TrailerModal
        youtubeId={youtubeId}
        title={title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
