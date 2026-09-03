// Horizontal scrollable movie row component
import MovieCard from './MovieCard';
import { MovieWithProviders } from '@/lib/types';

interface MovieRowProps {
  title: string;
  emoji?: string;
  movies: MovieWithProviders[];
  emptyMessage?: string;
}

export default function MovieRow({ title, emoji, movies, emptyMessage }: MovieRowProps) {
  if (movies.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </h2>
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-zinc-500 text-sm">{emptyMessage || 'No movies found.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h2>
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
