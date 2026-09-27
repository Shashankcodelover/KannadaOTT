// Home Page — Mobile-first, direct film posters at the top, high-peak Kannada dubbed cinema
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import SyncAndDraftsStatusBar from '@/components/SyncAndDraftsStatusBar';
import {
  getSuperstarMovies,
  getLoveComedyMovies,
  getInvestigationThrillers,
  getFastTwistAction,
  getKannadaOriginals,
  getUpcomingMovies,
  enrichMoviesWithProviders,
  getTrendingMovies,
  getWatchProviders,
} from '@/lib/tmdb';
import { OTT_PLATFORM_MAP } from '@/lib/constants';
import { MovieWithProviders } from '@/lib/types';

// Revalidate every hour
export const revalidate = 3600;

async function getHeroMovie(): Promise<MovieWithProviders | null> {
  try {
    const trending = await getTrendingMovies();
    const candidate = trending.results.find(
      (m) =>
        m.backdrop_path &&
        m.vote_average >= 7.0 &&
        m.overview &&
        !m.genre_ids.includes(36)
    );
    const chosen = (candidate || trending.results[0]) as MovieWithProviders;
    if (!chosen) return null;

    if (chosen.watchProviders && chosen.watchProviders.flatrate?.length) {
      return chosen;
    }

    const providers = await getWatchProviders(chosen.id);
    const inProviders = providers.results?.IN;
    if (inProviders?.flatrate) {
      inProviders.flatrate = inProviders.flatrate.filter((p) =>
        OTT_PLATFORM_MAP.has(p.provider_id)
      );
    }
    return {
      ...chosen,
      watchProviders: inProviders,
      isKannada: chosen.original_language === 'kn',
      hasKannadaDub: chosen.original_language !== 'kn',
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  // Fetch movie groups in parallel
  const [
    superstarsRaw,
    loveComedyRaw,
    investigationRaw,
    fastTwistRaw,
    kannadaOriginalRaw,
    upcomingRaw,
    heroMovie,
  ] = await Promise.allSettled([
    getSuperstarMovies(),
    getLoveComedyMovies(),
    getInvestigationThrillers(),
    getFastTwistAction(),
    getKannadaOriginals(),
    getUpcomingMovies(),
    getHeroMovie(),
  ]);

  // Enrich with OTT provider data
  const [
    superstars,
    loveComedy,
    investigation,
    fastTwist,
    kannadaOriginals,
    upcoming,
  ] = await Promise.all([
    superstarsRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(superstarsRaw.value.results)
      : Promise.resolve([]),
    loveComedyRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(loveComedyRaw.value.results)
      : Promise.resolve([]),
    investigationRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(investigationRaw.value.results)
      : Promise.resolve([]),
    fastTwistRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(fastTwistRaw.value.results)
      : Promise.resolve([]),
    kannadaOriginalRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(kannadaOriginalRaw.value.results)
      : Promise.resolve([]),
    upcomingRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(upcomingRaw.value.results)
      : Promise.resolve([]),
  ]);

  const hero = heroMovie.status === 'fulfilled' ? heroMovie.value : null;

  return (
    <div className="pb-12">
      {/* Sleek, Low-Profile Hero Header */}
      {hero && (
        <div className="mb-2 sm:mb-4">
          <HeroSection movie={hero} />
        </div>
      )}

      {/* Slim 1-Line Dynamic Catalog Status Bar */}
      <SyncAndDraftsStatusBar totalCount={52} />

      {/* Direct Film Poster Rows — Visible Immediately */}
      <div className="pt-1 sm:pt-2 space-y-4 sm:space-y-6">
        {/* 1. Indian Superstars in Kannada Dubbed */}
        <MovieRow
          title="Superstar Cinema (ಕನ್ನಡ Dubbed)"
          emoji="👑"
          movies={superstars}
          emptyMessage="No superstar dubbed releases found."
        />

        {/* 2. Love-Comedy & Romance Mix */}
        <MovieRow
          title="Love-Comedy & Feel-Good Hits"
          emoji="💖"
          movies={loveComedy}
          emptyMessage="No love-comedy movies found."
        />

        {/* 3. Investigation Thrillers & Crime Mysteries */}
        <MovieRow
          title="Investigation Thrillers & Mysteries"
          emoji="🔍"
          movies={investigation}
          emptyMessage="No investigation thrillers found."
        />

        {/* 4. Fast & Furious Action, Tricks & High Stakes */}
        <MovieRow
          title="Action, Twists & High-Stakes Thrillers"
          emoji="⚡"
          movies={fastTwist}
          emptyMessage="No action thrillers found."
        />

        {/* 5. Modern Post-2017 Kannada Originals */}
        <MovieRow
          title="ಕನ್ನಡ Originals (Industry Hits)"
          emoji="🌟"
          movies={kannadaOriginals}
          emptyMessage="No Kannada originals found on these OTTs right now."
        />

        {/* 6. Upcoming Pre-OTT Theatrical Trackers */}
        <MovieRow
          title="Coming Soon (Pre-OTT Trackers)"
          emoji="📅"
          movies={upcoming}
          emptyMessage="No upcoming movies found."
        />
      </div>
    </div>
  );
}
