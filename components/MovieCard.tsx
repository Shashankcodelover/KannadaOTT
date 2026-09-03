// Movie Card component — poster, title, rating, OTT badges
import Link from 'next/link';
import Image from 'next/image';
import { MovieWithProviders } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import { OTT_PLATFORM_MAP } from '@/lib/constants';

interface MovieCardProps {
  movie: MovieWithProviders;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, 'medium');
  const rating = movie.vote_average.toFixed(1);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  // Filter to known Indian OTT providers only
  const availableOTTs = movie.watchProviders?.flatrate?.filter(
    (p) => OTT_PLATFORM_MAP.has(p.provider_id)
  ) ?? [];

  const ratingColor =
    movie.vote_average >= 7.5
      ? 'text-green-400'
      : movie.vote_average >= 6.5
      ? 'text-yellow-400'
      : 'text-orange-400';

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-40 sm:w-44 md:w-48 rounded-xl overflow-hidden
        bg-zinc-900 border border-zinc-800
        transition-all duration-300 ease-out
        hover:scale-105 hover:border-zinc-500 hover:shadow-2xl hover:shadow-black/60
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
        focus:scale-105
        cursor-pointer"
      tabIndex={0}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full bg-zinc-800">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 192px"
          priority={priority}
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.isKannada && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ಕನ್ನಡ
            </span>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`flex items-center gap-1 bg-black/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full ${ratingColor}`}
          >
            ★ {rating}
          </span>
        </div>

        {/* OTT logos overlay on hover */}
        {availableOTTs.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {availableOTTs.slice(0, 3).map((p) => {
              const platform = OTT_PLATFORM_MAP.get(p.provider_id);
              return p.logo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.provider_id}
                  src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                  alt={platform?.name || p.provider_name}
                  className="w-6 h-6 rounded object-contain"
                  title={platform?.name || p.provider_name}
                />
              ) : (
                <span key={p.provider_id} className="text-sm" title={platform?.name}>
                  {platform?.logo}
                </span>
              );
            })}
            {availableOTTs.length > 3 && (
              <span className="text-white text-xs bg-black/60 px-1 rounded">
                +{availableOTTs.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-xs">{year}</span>
          {availableOTTs.length > 0 ? (
            <span className="text-green-400 text-xs font-medium">Available ✓</span>
          ) : (
            <span className="text-zinc-600 text-xs">Not on OTT</span>
          )}
        </div>
      </div>
    </Link>
  );
}
