'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import FilterBar from '@/components/FilterBar';
import { FilterState, MovieWithProviders } from '@/lib/types';
import { OTT_IDS, DEFAULT_YEAR_FROM, CURRENT_YEAR } from '@/lib/constants';

const DEFAULT_FILTERS: FilterState = {
  genres: [],
  ottProviders: OTT_IDS,
  languages: [],
  yearFrom: DEFAULT_YEAR_FROM,
  yearTo: CURRENT_YEAR + 1,
  minRating: 6.0,
  sortBy: 'popularity.desc',
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [movies, setMovies] = useState<MovieWithProviders[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = useCallback(async (q: string, f: FilterState, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q,
        genres: f.genres.join(','),
        ottProviders: f.ottProviders.join(','),
        languages: f.languages.join(','),
        yearFrom: String(f.yearFrom),
        yearTo: String(f.yearTo),
        minRating: String(f.minRating),
        sortBy: f.sortBy,
        page: String(p),
      });
      const res = await fetch(`/api/movies?${params}`);
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      if (p === 1) {
        setMovies(data.movies || []);
      } else {
        setMovies((prev) => [...prev, ...(data.movies || [])]);
      }
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(query, filters, 1);
  }, [query, filters, fetchMovies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    if (inputValue) {
      router.push(`/search?q=${encodeURIComponent(inputValue)}`, { scroll: false });
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, filters, nextPage);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl sm:text-3xl font-black mb-4">
          🔍 Browse Movies
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by movie name..."
            className="
              flex-1 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500
              rounded-xl px-4 py-3 text-sm sm:text-base
              focus:outline-none focus:border-white focus:ring-1 focus:ring-white
            "
          />
          <button
            type="submit"
            className="
              bg-white text-black font-bold px-5 py-3 rounded-xl
              hover:bg-zinc-200 active:bg-zinc-300 transition-colors
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
            "
          >
            Search
          </button>
        </form>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="
            flex items-center gap-2 text-sm font-medium
            text-zinc-400 hover:text-white transition-colors
            focus:outline-none focus:ring-2 focus:ring-white rounded
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {(filters.genres.length > 0 || filters.languages.length > 0) && (
            <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {filters.genres.length + filters.languages.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <FilterBar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="text-zinc-400 text-sm">
          {query ? (
            <>Searching for: <span className="text-white font-medium">&quot;{query}&quot;</span></>
          ) : (
            'All movies on Indian OTTs'
          )}
          {movies.length > 0 && !loading && (
            <span className="text-zinc-600 ml-2">({movies.length} shown)</span>
          )}
        </p>
        {filters.languages.includes('kn') && (
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold px-3 py-1 rounded-full">
            ✓ Kannada Filter Active
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 mb-6">
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-red-400 text-xs mt-1">
            Make sure your TMDB_API_KEY is set in .env.local
          </p>
        </div>
      )}

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">No movies found.</p>
          <p className="text-zinc-600 text-sm mt-2">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : null}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More */}
      {!loading && movies.length > 0 && page < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="
              bg-zinc-800 hover:bg-zinc-700 text-white font-semibold
              px-8 py-3 rounded-xl transition-colors
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
            "
          >
            Load More Movies
          </button>
        </div>
      )}
    </div>
  );
}
