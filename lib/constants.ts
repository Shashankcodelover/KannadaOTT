// Constants for KannadaOTT Finder
import { OTTPlatform } from './types';

// ─── TMDB Config ────────────────────────────────────────────────
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
} as const;
export const TMDB_BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original',
} as const;

// ─── Indian OTT Platforms ────────────────────────────────────────
// Provider IDs sourced from TMDB/JustWatch for India (watch_region=IN)
// NOTE: Netflix & Amazon Prime excluded by user preference — free/regional OTTs only
export const OTT_PLATFORMS: OTTPlatform[] = [
  {
    id: 122,
    name: 'JioHotstar',
    shortName: 'Hotstar',
    color: '#0B76DA',
    bgColor: '#040E16',
    logo: '⭐',
    webUrl: 'https://www.hotstar.com/in',
  },
  {
    id: 232,
    name: 'Zee5',
    shortName: 'Zee5',
    color: '#7B2D8B',
    bgColor: '#1A0A1E',
    logo: '🟣',
    webUrl: 'https://www.zee5.com',
  },
  {
    id: 237,
    name: 'SonyLIV',
    shortName: 'SonyLIV',
    color: '#4A90D9',
    bgColor: '#0F2A4A',
    logo: '🔷',
    webUrl: 'https://www.sonyliv.com',
  },
  {
    id: 220,
    name: 'JioCinema',
    shortName: 'JioCinema',
    color: '#0082EF',
    bgColor: '#071629',
    logo: '🎬',
    webUrl: 'https://www.jiocinema.com',
  },
];

export const OTT_PLATFORM_MAP = new Map(OTT_PLATFORMS.map((p) => [p.id, p]));
export const OTT_IDS = OTT_PLATFORMS.map((p) => p.id);

// ─── TMDB Genre IDs ──────────────────────────────────────────────
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIFI: 878,
  THRILLER: 53,
  WAR: 10752,
} as const;

// Genre list — ordered by user preference: comedy/family/realistic first
export const GENRE_LIST = [
  { id: GENRES.COMEDY, name: 'Comedy', emoji: '😂' },
  { id: GENRES.DRAMA, name: 'Drama', emoji: '🎭' },
  { id: GENRES.FAMILY, name: 'Family', emoji: '👨‍👩‍👧' },
  { id: GENRES.ROMANCE, name: 'Romance', emoji: '❤️' },
  { id: GENRES.ADVENTURE, name: 'Adventure', emoji: '🗺️' },
  { id: GENRES.MUSIC, name: 'Music', emoji: '🎵' },
  { id: GENRES.ANIMATION, name: 'Animation', emoji: '🎨' },
  { id: GENRES.MYSTERY, name: 'Mystery', emoji: '🔍' },
];

// ─── Language Codes ──────────────────────────────────────────────
export const LANGUAGES = {
  KANNADA: 'kn',
  HINDI: 'hi',
  TAMIL: 'ta',
  TELUGU: 'te',
  MALAYALAM: 'ml',
  ENGLISH: 'en',
} as const;

export const LANGUAGE_LIST = [
  { code: LANGUAGES.KANNADA, name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: LANGUAGES.HINDI, name: 'Hindi', native: 'हिंदी' },
  { code: LANGUAGES.TAMIL, name: 'Tamil', native: 'தமிழ்' },
  { code: LANGUAGES.TELUGU, name: 'Telugu', native: 'తెలుగు' },
  { code: LANGUAGES.MALAYALAM, name: 'Malayalam', native: 'മലയാളം' },
  { code: LANGUAGES.ENGLISH, name: 'English', native: 'English' },
];

// ─── Current Year Range ──────────────────────────────────────────
export const CURRENT_YEAR = new Date().getFullYear();
export const DEFAULT_YEAR_FROM = CURRENT_YEAR - 2;
export const DEFAULT_YEAR_TO = CURRENT_YEAR + 1;

// ─── Sort Options ────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
];
