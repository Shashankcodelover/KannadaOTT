// TMDB API helper functions for KannadaOTT Finder
// Automatically integrates with Curated Catalog when API key is not present or TMDB is blocked in India.

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
import { CURATED_MOVIES, getCatalogMovieDetails } from './catalog';

// ─── API Key Helper ──────────────────────────────────────────────
export function getApiKey(): string | null {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key || key.includes('your_tmdb_api_key') || key.trim() === '') {
    return null;
  }
  return key;
}

// ─── Base Fetch ──────────────────────────────────────────────────
async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── Image URL Helpers ───────────────────────────────────────────
export function getPosterUrl(
  path: string | null,
  size: keyof typeof TMDB_POSTER_SIZES = 'large'
): string {
  if (!path) return '/placeholder-poster.svg';
  if (path.startsWith('/posters/') || path.startsWith('/placeholder')) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES[size]}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof TMDB_BACKDROP_SIZES = 'large'
): string {
  if (!path) return '/placeholder-backdrop.svg';
  if (path.startsWith('/posters/') || path.startsWith('/placeholder')) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${TMDB_IMAGE_BASE}/${TMDB_BACKDROP_SIZES[size]}${path}`;
}

export function getProviderLogoUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${TMDB_IMAGE_BASE}/w45${path}`;
}

// ─── Filter Curated Catalog Helper ──────────────────────────────
function filterCatalog(predicate: (m: MovieWithProviders) => boolean): TMDBResponse<Movie> {
  const results = CURATED_MOVIES.filter(predicate);
  return {
    page: 1,
    results,
    total_pages: 1,
    total_results: results.length,
  };
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
    yearFrom = CURRENT_YEAR - 3,
    yearTo = CURRENT_YEAR + 1,
    minRating = 6.0,
    sortBy = 'popularity.desc',
    page = 1,
    withOriginalLanguage,
  } = options;

  try {
    const params: Record<string, string | number | boolean> = {
      language,
      sort_by: sortBy,
      watch_region: 'IN',
      'primary_release_date.gte': `${yearFrom}-01-01`,
      'primary_release_date.lte': `${yearTo}-12-31`,
      'vote_average.gte': minRating,
      'vote_count.gte': 50,
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

    return await tmdbFetch<TMDBResponse<Movie>>('/discover/movie', params);
  } catch {
    // Fallback to rich curated catalog
    return filterCatalog((m) => {
      if (withOriginalLanguage && m.original_language !== withOriginalLanguage) {
        return false;
      }
      if (genres.length > 0 && !genres.some((g) => m.genre_ids.includes(g))) {
        return false;
      }
      if (m.vote_average < minRating) {
        return false;
      }
      if (m.release_date) {
        const year = parseInt(m.release_date.substring(0, 4));
        if (year < yearFrom || year > yearTo) return false;
      }
      return true;
    });
  }
}

// ─── Kannada Original Movies ─────────────────────────────────────
export async function getKannadaOriginals(page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      withOriginalLanguage: LANGUAGES.KANNADA,
      ottProviders: OTT_IDS,
      sortBy: 'vote_average.desc',
      minRating: 6.0,
      yearFrom: 2018,
      yearTo: CURRENT_YEAR + 1,
      page,
    });
  } catch {
    return filterCatalog((m) => m.original_language === LANGUAGES.KANNADA);
  }
}

// ─── Kannada Dubbed — Hindi originals on Indian OTTs ─────────────
export async function getKannadaDubbedHindi(page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      withOriginalLanguage: LANGUAGES.HINDI,
      ottProviders: OTT_IDS,
      genres: [GENRES.COMEDY, GENRES.DRAMA, GENRES.FAMILY, GENRES.ROMANCE],
      sortBy: 'vote_average.desc',
      minRating: 6.5,
      yearFrom: CURRENT_YEAR - 3,
      yearTo: CURRENT_YEAR + 1,
      page,
    });
  } catch {
    return filterCatalog((m) => m.original_language === LANGUAGES.HINDI);
  }
}

// ─── Kannada Dubbed — Tamil originals on Indian OTTs ─────────────
export async function getKannadaDubbedTamil(page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      withOriginalLanguage: LANGUAGES.TAMIL,
      ottProviders: OTT_IDS,
      genres: [GENRES.COMEDY, GENRES.DRAMA, GENRES.FAMILY, GENRES.ROMANCE, GENRES.MYSTERY],
      sortBy: 'vote_average.desc',
      minRating: 6.5,
      yearFrom: CURRENT_YEAR - 3,
      yearTo: CURRENT_YEAR + 1,
      page,
    });
  } catch {
    return filterCatalog((m) => m.original_language === LANGUAGES.TAMIL);
  }
}

// ─── Kannada Dubbed — Telugu originals on Indian OTTs ────────────
export async function getKannadaDubbedTelugu(page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      withOriginalLanguage: LANGUAGES.TELUGU,
      ottProviders: OTT_IDS,
      genres: [GENRES.COMEDY, GENRES.DRAMA, GENRES.FAMILY, GENRES.ROMANCE, GENRES.FANTASY],
      sortBy: 'vote_average.desc',
      minRating: 6.5,
      yearFrom: CURRENT_YEAR - 3,
      yearTo: CURRENT_YEAR + 1,
      page,
    });
  } catch {
    return filterCatalog((m) => m.original_language === LANGUAGES.TELUGU);
  }
}

// ─── Trending Movies (India region) ──────────────────────────────
export async function getTrendingMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await tmdbFetch<TMDBResponse<Movie>>('/trending/movie/week', {
      language: 'en-US',
      region: 'IN',
    });
  } catch {
    // Return curated titles sorted by rating
    const sorted = [...CURATED_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    return {
      page: 1,
      results: sorted,
      total_pages: 1,
      total_results: sorted.length,
    };
  }
}

// ─── Upcoming Movies ─────────────────────────────────────────────
export async function getUpcomingMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', {
      language: 'en-US',
      region: 'IN',
      page: 1,
    });
  } catch {
    return filterCatalog((m) => m.id >= 500);
  }
}

// ─── Movies by Genre (on our 4 OTTs) ─────────────────────────────
export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      genres: [genreId],
      ottProviders: OTT_IDS,
      sortBy: 'vote_average.desc',
      minRating: 6.5,
      page,
    });
  } catch {
    return filterCatalog((m) => m.genre_ids.includes(genreId));
  }
}

// ─── Feel-Good & Comedy (user's preference) ───────────────────────
export async function getFeelGoodMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      genres: [GENRES.COMEDY, GENRES.FAMILY, GENRES.ROMANCE],
      ottProviders: OTT_IDS,
      sortBy: 'vote_average.desc',
      minRating: 7.0,
      yearFrom: CURRENT_YEAR - 3,
    });
  } catch {
    return filterCatalog(
      (m) =>
        m.genre_ids.includes(GENRES.COMEDY) ||
        m.genre_ids.includes(GENRES.FAMILY) ||
        m.genre_ids.includes(GENRES.ROMANCE)
    );
  }
}

// ─── Realistic Drama (not fantasy/sci-fi/heavy action) ───────────
export async function getRealisticDramas(): Promise<TMDBResponse<Movie>> {
  try {
    return await discoverMovies({
      genres: [GENRES.DRAMA],
      ottProviders: OTT_IDS,
      sortBy: 'vote_average.desc',
      minRating: 7.0,
      yearFrom: CURRENT_YEAR - 3,
    });
  } catch {
    return filterCatalog(
      (m) =>
        m.genre_ids.includes(GENRES.DRAMA) &&
        !m.genre_ids.includes(GENRES.WAR) &&
        !m.genre_ids.includes(GENRES.SCIFI)
    );
  }
}

// ─── Movie Details ───────────────────────────────────────────────
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    return await tmdbFetch<MovieDetails>(`/movie/${movieId}`, {
      language: 'en-US',
    });
  } catch {
    const details = getCatalogMovieDetails(movieId);
    if (details) return details;
    throw new Error(`Movie with ID ${movieId} not found`);
  }
}

// ─── Watch Providers ─────────────────────────────────────────────
export async function getWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
  try {
    return await tmdbFetch<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
  } catch {
    const movie = CURATED_MOVIES.find((m) => m.id === movieId);
    return {
      id: movieId,
      results: {
        IN: movie?.watchProviders || {
          link: 'https://www.hotstar.com/in',
          flatrate: [
            {
              provider_id: 122,
              provider_name: 'JioHotstar',
              logo_path: '',
              display_priority: 1,
              directUrl: 'https://www.hotstar.com/in',
            },
          ],
        },
      },
    };
  }
}

// ─── Search Movies ───────────────────────────────────────────────
export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await tmdbFetch<TMDBResponse<Movie>>('/search/movie', {
      query,
      language: 'en-US',
      region: 'IN',
      page,
      include_adult: false,
    });
  } catch {
    const q = query.toLowerCase().trim();
    return filterCatalog(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.original_title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q)
    );
  }
}

// ─── Fetch Movie + Providers Together ───────────────────────────
export async function getMovieWithProviders(movieId: number): Promise<MovieWithProviders> {
  const local = CURATED_MOVIES.find((m) => m.id === movieId);
  if (local) return local;

  const [details, providers] = await Promise.all([
    getMovieDetails(movieId),
    getWatchProviders(movieId),
  ]);
  return {
    ...details,
    watchProviders: providers.results?.IN,
    isKannada: details.original_language === LANGUAGES.KANNADA,
    hasKannadaDub: details.original_language !== LANGUAGES.KANNADA,
  };
}

// ─── Enriched Movie List (adds provider data) ─────────────────────
export async function enrichMoviesWithProviders(
  movies: Movie[]
): Promise<MovieWithProviders[]> {
  const enriched = await Promise.allSettled(
    movies.map(async (movie) => {
      // If already has watchProviders (from curated catalog), preserve it
      const existing = movie as MovieWithProviders;
      if (existing.watchProviders && existing.watchProviders.flatrate?.length) {
        return existing;
      }

      const providers = await getWatchProviders(movie.id);
      const inProviders = providers.results?.IN;
      if (inProviders?.flatrate) {
        inProviders.flatrate = inProviders.flatrate.filter((p) =>
          OTT_IDS.includes(p.provider_id)
        );
      }
      return {
        ...movie,
        watchProviders: inProviders,
        isKannada: movie.original_language === LANGUAGES.KANNADA,
        hasKannadaDub: movie.original_language !== LANGUAGES.KANNADA,
      } as MovieWithProviders;
    })
  );

  return enriched
    .filter((r): r is PromiseFulfilledResult<MovieWithProviders> => r.status === 'fulfilled')
    .map((r) => r.value);
}

// ─── Superstar Dubbed Releases (Jr. NTR, Vijay, Mahesh Babu, Venkatesh) ─
export async function getSuperstarMovies(heroName?: string): Promise<TMDBResponse<Movie>> {
  if (heroName) {
    return filterCatalog(
      (m) => m.hero_name?.toLowerCase().includes(heroName.toLowerCase()) ?? false
    );
  }
  return filterCatalog((m) => !!m.hero_name || (m.id >= 601 && m.id <= 608));
}

