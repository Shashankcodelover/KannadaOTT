// TMDB API helper functions for KannadaOTT Finder
import {
  Movie,
  MovieDetails,
  TMDBResponse,
  WatchProvidersResponse,
  MovieWithProviders,
} from './types';
import {
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE,
  TMDB_POSTER_SIZES,
  TMDB_BACKDROP_SIZES,
  OTT_IDS,
  GENRES,
  LANGUAGES,
  CURRENT_YEAR,
} from './constants';

// ─── API Key Helper ──────────────────────────────────────────────
function getApiKey(): string {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      'TMDB_API_KEY is not set. Add it to your .env.local file.\nGet a free key at: https://www.themoviedb.org/settings/api'
    );
  }
  return key;
}

// ─── Base Fetch ──────────────────────────────────────────────────
async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText} for ${endpoint}`);
  }
  return res.json() as Promise<T>;
}

// ─── Image URL Helpers ───────────────────────────────────────────
export function getPosterUrl(
  path: string | null,
  size: keyof typeof TMDB_POSTER_SIZES = 'large'
): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES[size]}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof TMDB_BACKDROP_SIZES = 'large'
): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE}/${TMDB_BACKDROP_SIZES[size]}${path}`;
}

export function getProviderLogoUrl(path: string): string {
  return `${TMDB_IMAGE_BASE}/w45${path}`;
}

// ─── Discover Movies ─────────────────────────────────────────────
export async function discoverMovies(options: {
  language?: string;
  genres?: number[];
  ottProviders?: number[];
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  withOriginalLanguage?: string;
}): Promise<TMDBResponse<Movie>> {
  const {
    language = 'en-US',
    genres = [],
    ottProviders = OTT_IDS,
    yearFrom = CURRENT_YEAR - 2,
    yearTo = CURRENT_YEAR + 1,
    minRating = 6.0,
    sortBy = 'popularity.desc',
    page = 1,
    withOriginalLanguage,
  } = options;

  const params: Record<string, string | number | boolean> = {
    language,
    sort_by: sortBy,
    watch_region: 'IN',
    'primary_release_date.gte': `${yearFrom}-01-01`,
    'primary_release_date.lte': `${yearTo}-12-31`,
    'vote_average.gte': minRating,
    'vote_count.gte': 100,
    page,
    include_adult: false,
  };

  if (genres.length > 0) {
    params['with_genres'] = genres.join('|');
  }
  if (ottProviders.length > 0) {
    params['with_watch_providers'] = ottProviders.join('|');
    params['with_watch_monetization_types'] = 'flatrate';
  }
  if (withOriginalLanguage) {
    params['with_original_language'] = withOriginalLanguage;
  }

  return tmdbFetch<TMDBResponse<Movie>>('/discover/movie', params);
}

// ─── Kannada Original Movies ─────────────────────────────────────
export async function getKannadaMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return discoverMovies({
    withOriginalLanguage: LANGUAGES.KANNADA,
    ottProviders: OTT_IDS,
    sortBy: 'vote_average.desc',
    minRating: 6.5,
    page,
  });
}

// ─── Trending Movies (India) ─────────────────────────────────────
export async function getTrendingMovies(): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>('/trending/movie/week', {
    language: 'en-US',
    region: 'IN',
  });
}

// ─── Upcoming Movies ─────────────────────────────────────────────
export async function getUpcomingMovies(): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', {
    language: 'en-US',
    region: 'IN',
    page: 1,
  });
}

// ─── Movies by Genre ─────────────────────────────────────────────
export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<Movie>> {
  return discoverMovies({
    genres: [genreId],
    ottProviders: OTT_IDS,
    sortBy: 'vote_average.desc',
    minRating: 6.5,
    page,
  });
}

// ─── Movie Details ───────────────────────────────────────────────
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}`, {
    language: 'en-US',
  });
}

// ─── Watch Providers ─────────────────────────────────────────────
export async function getWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
  return tmdbFetch<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
}

// ─── Search Movies ───────────────────────────────────────────────
export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>('/search/movie', {
    query,
    language: 'en-US',
    region: 'IN',
    page,
    include_adult: false,
  });
}

// ─── Fetch Movie + Providers Together ───────────────────────────
export async function getMovieWithProviders(movieId: number): Promise<MovieWithProviders> {
  const [details, providers] = await Promise.all([
    getMovieDetails(movieId),
    getWatchProviders(movieId),
  ]);
  return {
    ...details,
    watchProviders: providers.results?.IN,
    isKannada: details.original_language === LANGUAGES.KANNADA,
  };
}

// ─── Enriched Movie List (adds provider data) ─────────────────────
export async function enrichMoviesWithProviders(
  movies: Movie[]
): Promise<MovieWithProviders[]> {
  const enriched = await Promise.allSettled(
    movies.slice(0, 20).map(async (movie) => {
      const providers = await getWatchProviders(movie.id);
      const inProviders = providers.results?.IN;
      // Filter to only our known Indian OTTs
      if (inProviders?.flatrate) {
        inProviders.flatrate = inProviders.flatrate.filter((p) =>
          OTT_IDS.includes(p.provider_id)
        );
      }
      return {
        ...movie,
        watchProviders: inProviders,
        isKannada: movie.original_language === LANGUAGES.KANNADA,
      } as MovieWithProviders;
    })
  );

  return enriched
    .filter((r): r is PromiseFulfilledResult<MovieWithProviders> => r.status === 'fulfilled')
    .map((r) => r.value);
}

// ─── Feel-Good / Family Movies ────────────────────────────────────
export async function getFeelGoodMovies(): Promise<TMDBResponse<Movie>> {
  return discoverMovies({
    genres: [GENRES.COMEDY, GENRES.FAMILY, GENRES.ROMANCE],
    ottProviders: OTT_IDS,
    sortBy: 'vote_average.desc',
    minRating: 7.0,
  });
}

// ─── High Rated Indian Region ────────────────────────────────────
export async function getTopRatedIndianOTT(): Promise<TMDBResponse<Movie>> {
  return discoverMovies({
    ottProviders: OTT_IDS,
    sortBy: 'vote_average.desc',
    minRating: 7.5,
    yearFrom: CURRENT_YEAR - 2,
  });
}
