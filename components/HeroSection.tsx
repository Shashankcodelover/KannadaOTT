// Hero Section — big featured movie with backdrop
import Image from 'next/image';
import Link from 'next/link';
import { MovieWithProviders } from '@/lib/types';
import { getBackdropUrl } from '@/lib/tmdb';
import { OTT_PLATFORM_MAP } from '@/lib/constants';
import OTTBadge from './OTTBadge';

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
    <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 max-w-2xl">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.isKannada && (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ✓ Kannada Original
            </span>
          )}
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            ★ {movie.vote_average.toFixed(1)} Rating
          </span>
          {year && (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
              {year}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 drop-shadow-lg">
          {movie.title}
        </h1>

        {/* Overview */}
        <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 mb-5 leading-relaxed max-w-lg">
          {movie.overview}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href={`/movie/${movie.id}`}
            className="
              inline-flex items-center gap-2 bg-white text-black font-bold
              px-5 py-3 rounded-lg text-sm sm:text-base
              hover:bg-zinc-200 active:bg-zinc-300
              transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
            "
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            More Info
          </Link>

          {/* OTT Watch Buttons */}
          {availableOTTs.slice(0, 2).map((provider) => (
            <OTTBadge
              key={provider.provider_id}
              provider={provider}
              movieLink={movie.watchProviders?.link}
              size="md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
