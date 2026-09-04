// Hero Section — big featured movie with backdrop and Hotstar/Prime style features
import Image from 'next/image';
import Link from 'next/link';
import { MovieWithProviders } from '@/lib/types';
import { getBackdropUrl } from '@/lib/tmdb';
import { OTT_PLATFORM_MAP } from '@/lib/constants';
import OTTBadge from './OTTBadge';
import WatchTrailerButton from './WatchTrailerButton';

interface HeroSectionProps {
  movie: MovieWithProviders;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const availableOTTs = movie.watchProviders?.flatrate?.filter(
    (p) => OTT_PLATFORM_MAP.has(p.provider_id)
  ) ?? [];
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden border-b border-zinc-800">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          loading="eager"
          unoptimized
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 max-w-3xl">
        {/* Badges / Salt Features before watching */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {movie.isKannada ? (
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              ✓ ಕನ್ನಡ Original
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              ✓ ಕನ್ನಡ Dubbed Audio Verified
            </span>
          )}

          <span className="bg-black/70 backdrop-blur-sm text-yellow-400 border border-yellow-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          {movie.age_rating && (
            <span className="bg-zinc-800/90 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-zinc-700">
              {movie.age_rating}
            </span>
          )}

          {year && (
            <span className="bg-zinc-800/90 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-zinc-700">
              {year}
            </span>
          )}

          {movie.quality && (
            <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-700/50">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
          {movie.title}
        </h1>

        {/* Highlights List (Prime/Hotstar style) */}
        {movie.highlights && movie.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold text-amber-300">
            {movie.highlights.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span>•</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 mb-5 leading-relaxed max-w-2xl">
          {movie.overview}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Watch Trailer / Scene Preview Button */}
          {movie.trailer_youtube_id && (
            <WatchTrailerButton
              youtubeId={movie.trailer_youtube_id}
              title={movie.title}
              variant="primary"
              label="▶ Watch Trailer / Scenes"
            />
          )}

          {/* OTT Watch Buttons - direct stream link */}
          {availableOTTs.slice(0, 2).map((provider) => (
            <OTTBadge
              key={provider.provider_id}
              provider={provider}
              movieLink={movie.watchProviders?.link}
              size="lg"
            />
          ))}

          <Link
            href={`/movie/${movie.id}`}
            className="
              inline-flex items-center gap-2 bg-zinc-800/90 text-white font-bold
              px-5 py-3 rounded-lg text-sm sm:text-base border border-zinc-700
              hover:bg-zinc-700 active:bg-zinc-600
              transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
            "
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Movie Details
          </Link>
        </div>
      </div>
    </div>
  );
}
