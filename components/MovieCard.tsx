'use client';

// Movie Card component — poster, title, rating, OTT badges, Kannada audio tag + Watched/Done Hide
import Link from 'next/link';
import Image from 'next/image';
import { MovieWithProviders } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import { OTT_PLATFORM_MAP } from '@/lib/constants';
import { useWatched } from '@/context/WatchedContext';

interface MovieCardProps {
  movie: MovieWithProviders;
  priority?: boolean;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { isWatched, markAsWatched, unmarkAsWatched, hideWatched } = useWatched();
  const watched = isWatched(movie.id);

  // If user enabled hiding watched movies and this movie is watched, hide it from discovery
  if (hideWatched && watched) {
    return null;
  }

  const posterUrl = getPosterUrl(movie.poster_path, 'medium');
  const rating = movie.vote_average.toFixed(1);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  // Filter to known Indian OTT providers only
  const availableOTTs =
    movie.watchProviders?.flatrate?.filter((p) => OTT_PLATFORM_MAP.has(p.provider_id)) ?? [];

  const mainPlatform = availableOTTs[0] ? OTT_PLATFORM_MAP.get(availableOTTs[0].provider_id) : null;

  const ratingColor =
    movie.vote_average >= 7.5
      ? 'text-green-400'
      : movie.vote_average >= 6.5
      ? 'text-yellow-400'
      : 'text-orange-400';

  const handleToggleWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (watched) {
      unmarkAsWatched(movie.id);
    } else {
      markAsWatched(
        { id: movie.id, title: movie.title, poster_path: movie.poster_path },
        mainPlatform?.shortName
      );
    }
  };

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-44 sm:w-48 md:w-52 rounded-xl overflow-hidden
        bg-zinc-900 border border-zinc-800
        transition-all duration-300 ease-out
        hover:scale-105 hover:border-zinc-500 hover:shadow-2xl hover:shadow-black/70
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
        focus:scale-105
        cursor-pointer"
      tabIndex={0}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 176px, (max-width: 768px) 192px, 208px"
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Badges Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {movie.isKannada ? (
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
              ಕನ್ನಡ Original
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
              ಕನ್ನಡ Dubbed
            </span>
          )}
        </div>

        {/* Rating & Mark Done Button (Right) */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-20">
          <span
            className={`flex items-center gap-1 bg-black/85 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full border border-zinc-700 shadow ${ratingColor}`}
          >
            ★ {rating}
          </span>

          {/* Quick 1-Click "Mark as Done / Watched" Button */}
          <button
            onClick={handleToggleWatched}
            title={watched ? 'Marked as watched (moved to Drafts)' : 'Mark as Done / Watched (hides movie)'}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg transition-all cursor-pointer ${
              watched
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : 'bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 opacity-90 group-hover:opacity-100 hover:scale-105'
            }`}
          >
            <span>{watched ? '✓ Done' : '✓ Watched'}</span>
          </button>
        </div>

        {/* Quality indicator on image bottom */}
        {movie.quality && (
          <div className="absolute bottom-2 left-2 z-10 text-[10px] text-zinc-300 bg-black/70 px-1.5 py-0.5 rounded font-medium">
            {movie.quality.split('•')[0].trim()}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="text-white text-sm font-bold line-clamp-1 leading-tight mb-1 group-hover:text-amber-400 transition-colors">
          {movie.title}
        </h3>

        {/* Metadata & Audio Badge */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-zinc-400">{year}</span>
          <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
            ✓ 2-Way Verified
          </span>
        </div>

        {/* Primary OTT Button Bar */}
        {(movie as { isUpcoming?: boolean }).isUpcoming ? (
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold w-full bg-amber-950/40 text-amber-400 border border-amber-500/40">
            <span>🎟️</span>
            <span>In Theatres Soon</span>
          </div>
        ) : mainPlatform ? (
          <div
            onClick={() =>
              markAsWatched(
                { id: movie.id, title: movie.title, poster_path: movie.poster_path },
                mainPlatform.shortName
              )
            }
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold w-full transition-colors hover:brightness-110"
            style={{
              backgroundColor: `${mainPlatform.color}25`,
              color: mainPlatform.color,
              border: `1px solid ${mainPlatform.color}50`,
            }}
          >
            <span>{mainPlatform.logo}</span>
            <span>Watch on {mainPlatform.shortName}</span>
          </div>
        ) : (
          <div className="text-zinc-500 text-xs text-center py-1">Check Availability</div>
        )}
      </div>
    </Link>
  );
}
