// TypeScript types for KannadaOTT Finder

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  spoken_languages: SpokenLanguage[];
  production_countries: ProductionCountry[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviderResult {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    IN?: WatchProviderResult;
    [key: string]: WatchProviderResult | undefined;
  };
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieWithProviders extends Movie {
  watchProviders?: WatchProviderResult;
  isKannada?: boolean;
}

export interface FilterState {
  genres: number[];
  ottProviders: number[];
  languages: string[];
  yearFrom: number;
  yearTo: number;
  minRating: number;
  sortBy: string;
}

export interface OTTPlatform {
  id: number;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  logo: string;
  webUrl: string;
}
