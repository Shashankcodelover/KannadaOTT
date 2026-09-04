// Filter bar component for search/browse page
'use client';

import { GENRE_LIST, OTT_PLATFORMS, LANGUAGE_LIST, SORT_OPTIONS } from '@/lib/constants';
import { FilterState } from '@/lib/types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const toggleGenre = (id: number) => {
    const genres = filters.genres.includes(id)
      ? filters.genres.filter((g) => g !== id)
      : [...filters.genres, id];
    onChange({ ...filters, genres });
  };

  const toggleOTT = (id: number) => {
    const ottProviders = filters.ottProviders.includes(id)
      ? filters.ottProviders.filter((o) => o !== id)
      : [...filters.ottProviders, id];
    onChange({ ...filters, ottProviders });
  };

  const toggleLanguage = (code: string) => {
    const languages = filters.languages.includes(code)
      ? filters.languages.filter((l) => l !== code)
      : [...filters.languages, code];
    onChange({ ...filters, languages });
  };

  return (
    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-5">
      {/* Sort */}
      <div>
        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm w-full
            focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* OTT Platforms */}
      <div>
        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          OTT Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {OTT_PLATFORMS.map((platform) => {
            const active = filters.ottProviders.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => toggleOTT(platform.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 border
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-zinc-900
                  ${active
                    ? 'scale-105'
                    : 'opacity-50 hover:opacity-75 bg-zinc-800 border-zinc-700 text-zinc-400'}
                `}
                style={active ? {
                  backgroundColor: `${platform.color}25`,
                  color: platform.color,
                  borderColor: platform.color,
                } : undefined}
              >
                {platform.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRE_LIST.map((genre) => {
            const active = filters.genres.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-zinc-900
                  ${active
                    ? 'bg-white text-black border-white scale-105'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'}
                `}
              >
                {genre.emoji} {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kannada Audio & Dubbing */}
      <div>
        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          Kannada Audio Type
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const active = filters.languages.includes('kn') && filters.languages.length === 1;
              onChange({ ...filters, languages: active ? [] : ['kn'] });
            }}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
              focus:outline-none focus:ring-2 focus:ring-white
              ${filters.languages.includes('kn') && filters.languages.length === 1
                ? 'bg-orange-600 text-white border-orange-500 scale-105 shadow'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'}
            `}
          >
            ✓ ಕನ್ನಡ Originals Only
          </button>

          <button
            onClick={() => {
              const dubbedCodes = ['hi', 'ta', 'te', 'ml'];
              const active = dubbedCodes.some((c) => filters.languages.includes(c));
              onChange({ ...filters, languages: active ? [] : dubbedCodes });
            }}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
              focus:outline-none focus:ring-2 focus:ring-white
              ${['hi', 'ta', 'te', 'ml'].some((c) => filters.languages.includes(c))
                ? 'bg-emerald-600 text-white border-emerald-500 scale-105 shadow'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'}
            `}
          >
            ✓ ಕನ್ನಡ Dubbed Movies Only
          </button>

          <button
            onClick={() => onChange({ ...filters, languages: [] })}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
              focus:outline-none focus:ring-2 focus:ring-white
              ${filters.languages.length === 0
                ? 'bg-white text-black border-white scale-105'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}
            `}
          >
            All Kannada (Original + Dubbed)
          </button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          Min Rating: <span className="text-white">{filters.minRating.toFixed(1)} ★</span>
        </label>
        <input
          type="range"
          min={5}
          max={9}
          step={0.5}
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: parseFloat(e.target.value) })}
          className="w-full accent-white"
        />
        <div className="flex justify-between text-zinc-600 text-xs mt-1">
          <span>5.0</span>
          <span>9.0</span>
        </div>
      </div>

      {/* Year Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
            From Year
          </label>
          <input
            type="number"
            min={2020}
            max={filters.yearTo}
            value={filters.yearFrom}
            onChange={(e) => onChange({ ...filters, yearFrom: parseInt(e.target.value) })}
            className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm w-full
              focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>
        <div>
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">
            To Year
          </label>
          <input
            type="number"
            min={filters.yearFrom}
            max={2027}
            value={filters.yearTo}
            onChange={(e) => onChange({ ...filters, yearTo: parseInt(e.target.value) })}
            className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm w-full
              focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>
      </div>
    </div>
  );
}
