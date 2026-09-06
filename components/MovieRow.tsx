'use client';

// Horizontal scrollable movie row component with dynamic watched filtering
import MovieCard from './MovieCard';
import { MovieWithProviders } from '@/lib/types';
import { useWatched } from '@/context/WatchedContext';

interface MovieRowProps {
  title: string;
  emoji?: string;
  movies: MovieWithProviders[];
  emptyMessage?: string;
}

export default function MovieRow({ title, emoji, movies, emptyMessage }: MovieRowProps) {
  const { isExcluded, hideWatched } = useWatched();

  const visibleMovies = hideWatched ? movies.filter((m) => !isExcluded(m.id)) : movies;
  const excludedCountInThisRow = movies.filter((m) => isExcluded(m.id)).length;

  if (movies.length === 0) {
    return null;
  }

  // If all movies in this row were marked as watched or dismissed and hidden
  if (visibleMovies.length === 0 && excludedCountInThisRow > 0) {
    return (
      <section className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{emoji || '🎬'}</span>
            <span className="text-zinc-400 text-sm font-semibold">{title}</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
              ✓ All {excludedCountInThisRow} movies tracked
            </span>
          </div>
          <span className="text-zinc-500 text-xs">2-Year Anti-Repeat Cooldown Active</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-white text-xl sm:text-2xl font-bold">
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </h2>
        {excludedCountInThisRow > 0 && hideWatched && (
          <span className="text-zinc-500 text-xs font-medium">
            {excludedCountInThisRow} tracked in 2-yr cooldown
          </span>
        )}
      </div>

      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleMovies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
