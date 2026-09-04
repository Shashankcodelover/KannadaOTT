'use client';

import { useState } from 'react';

interface TrailerAndScenePlayerProps {
  title: string;
  trailerYoutubeId?: string;
  sceneClipDescription?: string;
  heroName?: string;
}

export default function TrailerAndScenePlayer({
  title,
  trailerYoutubeId,
  sceneClipDescription,
  heroName,
}: TrailerAndScenePlayerProps) {
  const [activeTab, setActiveTab] = useState<'trailer' | 'scene'>('trailer');
  const [isPlaying, setIsPlaying] = useState(false);

  // If no youtube ID is present, we provide a search fallback
  const ytId = trailerYoutubeId || 'NgBoMJy386M';

  // For 30-second scene clip mode, we can start at 45s and loop or provide key clip
  const embedUrl =
    activeTab === 'trailer'
      ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
      : `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&start=45&end=75&rel=0&modestbranding=1`;

  return (
    <section className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </span>
          <div>
            <h2 className="text-white text-sm sm:text-base font-black tracking-wide flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs font-normal text-zinc-400">— Official Video Preview</span>
            </h2>
            {heroName && (
              <span className="text-xs text-amber-400 font-semibold">
                Starring: {heroName} (Kannada Dubbed)
              </span>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('trailer');
              setIsPlaying(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'trailer'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            🎬 Official Trailer
          </button>

          <button
            onClick={() => {
              setActiveTab('scene');
              setIsPlaying(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'scene'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <span>⚡ 30s Key Scene</span>
            <span className="bg-black/30 text-[10px] px-1.5 py-0.2 rounded font-mono">CLIP</span>
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-black">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={`${title} ${activeTab === 'trailer' ? 'Trailer' : '30s Key Scene'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-zinc-950/80 to-zinc-900 p-6 text-center">
            {/* Big Play Button */}
            <button
              onClick={() => setIsPlaying(true)}
              className="group flex flex-col items-center gap-3 focus:outline-none cursor-pointer"
              aria-label={`Play ${title} ${activeTab === 'trailer' ? 'Trailer' : 'Key Scene'}`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-white font-black text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                  {activeTab === 'trailer' ? 'Click to Watch Official Trailer' : 'Click to Preview 30-Second Key Scene'}
                </p>
                <p className="text-xs text-zinc-400 max-w-md">
                  {activeTab === 'trailer'
                    ? 'Watch official high-definition trailer with verified Kannada audio track.'
                    : sceneClipDescription || 'Instant 30-second preview of the movie’s most memorable sequence.'}
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2.5 bg-zinc-900/60 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓ High Definition 1080p</span>
          <span>•</span>
          <span className="text-zinc-300 font-medium">
            {activeTab === 'trailer'
              ? 'Full Official Preview'
              : `Key Scene: ${sceneClipDescription || '30s Major Sequence'}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab(activeTab === 'trailer' ? 'scene' : 'trailer');
              setIsPlaying(true);
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer"
          >
            {activeTab === 'trailer' ? 'Switch to 30s Key Scene ➔' : 'Switch to Full Trailer ➔'}
          </button>
        </div>
      </div>
    </section>
  );
}
