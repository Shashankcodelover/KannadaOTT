// OTT Badge component — shows platform logo + "Watch Now" button
'use client';

import { WatchProvider } from '@/lib/types';
import { OTT_PLATFORM_MAP } from '@/lib/constants';
import { getProviderLogoUrl } from '@/lib/tmdb';
import { useWatched } from '@/context/WatchedContext';

interface OTTBadgeProps {
  provider: WatchProvider;
  movieLink?: string; // JustWatch link as fallback
  size?: 'sm' | 'md' | 'lg';
  movie?: {
    id: number;
    title: string;
    poster_path?: string | null;
  };
}

export default function OTTBadge({ provider, movieLink, size = 'md', movie }: OTTBadgeProps) {
  const { markAsWatched } = useWatched();
  const platform = OTT_PLATFORM_MAP.get(provider.provider_id);
  const targetUrl = provider.directUrl || movieLink || platform?.webUrl || '#';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2',
  };

  const logoSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (movie) {
          markAsWatched(movie, platform?.shortName || provider.provider_name);
        }
      }}
      className={`
        inline-flex items-center rounded-lg font-semibold
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
        hover:scale-105 active:scale-95
        ${sizeClasses[size]}
      `}
      style={{
        backgroundColor: platform?.bgColor || '#1a1a1a',
        color: platform?.color || '#ffffff',
        border: `1px solid ${platform?.color || '#444'}`,
      }}
      aria-label={`Watch on ${provider.provider_name}`}
    >
      {provider.logo_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getProviderLogoUrl(provider.logo_path)}
          alt={provider.provider_name}
          className={`${logoSizes[size]} rounded object-contain`}
        />
      ) : (
        <span className="text-lg">{platform?.logo || '🎬'}</span>
      )}
      <span className="whitespace-nowrap">
        Watch on {platform?.shortName || provider.provider_name}
      </span>
      <svg
        className="w-3 h-3 opacity-70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}
