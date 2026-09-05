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
    <div className="relative w-full min-h-[230px] sm:min-h-[42vh] md:min-h-[48vh] flex items-end overflow-hidden border-b border-zinc-800">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover object-top sm:object-center"
          priority
          loading="eager"
          unoptimized
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-3.5 sm:px-6 lg:px-8 pt-20 pb-3 sm:pb-8 max-w-3xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
          {movie.isKannada ? (
            <span className="bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
              ✓ ಕನ್ನಡ Original
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
              ✓ ಕನ್ನಡ Dubbed
            </span>
          )}

          <span className="bg-black/75 backdrop-blur-sm text-yellow-400 border border-yellow-500/30 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          {year && (
            <span className="bg-zinc-800/90 text-zinc-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full border border-zinc-700">
              {year}
            </span>
          )}

          {movie.quality && (
            <span className="hidden xs:inline bg-blue-900/60 text-blue-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full border border-blue-700/50">
              {movie.quality.split('•')[0].trim()}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-white text-xl sm:text-3xl md:text-5xl font-black leading-tight mb-1 sm:mb-2 drop-shadow-lg">
          {movie.title}
        </h1>

        {/* Highlights List - hidden on narrow mobile to save vertical space */}
        {movie.highlights && movie.highlights.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-2 mb-2 text-xs font-semibold text-amber-300">
            {movie.highlights.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span>•</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Overview - hidden on small mobile to ensure posters appear immediately below */}
        <p className="hidden sm:block text-zinc-300 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed max-w-2xl">
          {movie.overview}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center pt-0.5">
          {/* Watch Trailer Button */}
          {movie.trailer_youtube_id && (
            <WatchTrailerButton
              youtubeId={movie.trailer_youtube_id}
              title={movie.title}
              variant="primary"
              label="▶ Trailer"
            />
          )}

          {/* OTT Watch Button */}
          {availableOTTs.slice(0, 1).map((provider) => (
            <OTTBadge
              key={provider.provider_id}
              provider={provider}
              movieLink={movie.watchProviders?.link}
              size="md"
            />
          ))}

          <Link
            href={`/movie/${movie.id}`}
            className="
              inline-flex items-center gap-1.5 bg-zinc-800/90 text-white font-bold
              px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm border border-zinc-700
              hover:bg-zinc-700 active:bg-zinc-600
              transition-all duration-200
            "
          >
            Details ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
