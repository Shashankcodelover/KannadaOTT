// Home Page — updated with Kannada dubbed movies + Superstar Hub + Comedy/Feel-Good Focus
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import SyncAndDraftsStatusBar from '@/components/SyncAndDraftsStatusBar';
import {
  getTrendingMovies,
  getKannadaOriginals,
  getKannadaDubbedHindi,
  getKannadaDubbedTamil,
  getKannadaDubbedTelugu,
  getFeelGoodMovies,
  getRealisticDramas,
  getMoviesByGenre,
  getUpcomingMovies,
  getSuperstarMovies,
  enrichMoviesWithProviders,
  getWatchProviders,
} from '@/lib/tmdb';
import { GENRES, OTT_PLATFORM_MAP } from '@/lib/constants';
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
  // Fetch all movie rows in parallel
  const [
    trendingRaw,
    kannadaOriginalRaw,
    superstarsRaw,
    prabhasRaw,
    alluRaw,
    ntrRaw,
    vijayRaw,
    maheshRaw,
    venkyRaw,
    ramCharanRaw,
    dulquerRaw,
    kannadaHindiRaw,
    kannadaTamilRaw,
    kannadaTeluguRaw,
    feelGoodRaw,
    dramaRaw,
    comedyRaw,
    familyRaw,
    upcomingRaw,
    heroMovie,
  ] = await Promise.allSettled([
    getTrendingMovies(),
    getKannadaOriginals(),
    getSuperstarMovies(),
    getSuperstarMovies('Prabhas'),
    getSuperstarMovies('Allu Arjun'),
    getSuperstarMovies('Jr. NTR'),
    getSuperstarMovies('Thalapathy Vijay'),
    getSuperstarMovies('Mahesh Babu'),
    getSuperstarMovies('Victory Venkatesh'),
    getSuperstarMovies('Ram Charan'),
    getSuperstarMovies('Dulquer Salmaan'),
    getKannadaDubbedHindi(),
    getKannadaDubbedTamil(),
    getKannadaDubbedTelugu(),
    getFeelGoodMovies(),
    getRealisticDramas(),
    getMoviesByGenre(GENRES.COMEDY),
    getMoviesByGenre(GENRES.FAMILY),
    getUpcomingMovies(),
    getHeroMovie(),
  ]);

  // Enrich with OTT provider data (parallel)
  const [
    trending,
    kannadaOriginals,
    superstars,
    prabhasMovies,
    alluMovies,
    ntrMovies,
    vijayMovies,
    maheshMovies,
    venkyMovies,
    ramCharanMovies,
    dulquerMovies,
    kannadaHindi,
    kannadaTamil,
    kannadaTelugu,
    feelGood,
    drama,
    comedy,
    family,
    upcoming,
  ] = await Promise.all([
    trendingRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(trendingRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    kannadaOriginalRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(kannadaOriginalRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    superstarsRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(superstarsRaw.value.results)
      : Promise.resolve([]),
    prabhasRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(prabhasRaw.value.results)
      : Promise.resolve([]),
    alluRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(alluRaw.value.results)
      : Promise.resolve([]),
    ntrRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(ntrRaw.value.results)
      : Promise.resolve([]),
    vijayRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(vijayRaw.value.results)
      : Promise.resolve([]),
    maheshRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(maheshRaw.value.results)
      : Promise.resolve([]),
    venkyRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(venkyRaw.value.results)
      : Promise.resolve([]),
    ramCharanRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(ramCharanRaw.value.results)
      : Promise.resolve([]),
    dulquerRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(dulquerRaw.value.results)
      : Promise.resolve([]),
    kannadaHindiRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(kannadaHindiRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    kannadaTamilRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(kannadaTamilRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    kannadaTeluguRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(kannadaTeluguRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    feelGoodRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(feelGoodRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    dramaRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(dramaRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    comedyRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(comedyRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    familyRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(familyRaw.value.results.slice(0, 15))
      : Promise.resolve([]),
    upcomingRaw.status === 'fulfilled'
      ? enrichMoviesWithProviders(upcomingRaw.value.results.slice(0, 10))
      : Promise.resolve([]),
  ]);

  const hero = heroMovie.status === 'fulfilled' ? heroMovie.value : null;

  return (
    <div className="pb-10">
      {/* Hero */}
      {hero && (
        <div className="mb-8">
          <HeroSection movie={hero} />
        </div>
      )}

      {/* Dynamic Catalog & Watched Drafts Status Bar */}
      <SyncAndDraftsStatusBar totalCount={57} />

      {/* Superstar Category Highlights */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-6 p-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400 text-lg">👑</span>
          <h2 className="text-white font-black text-sm sm:text-base tracking-wide">
            Superstars in Kannada Dubbed — Watch on Indian OTTs
          </h2>
          <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Verified Audio
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-3">
          Blockbuster releases starring Indian cinema’s biggest heroes with high quality Kannada dubbed audio tracks on JioHotstar, Zee5, SonyLIV &amp; JioCinema.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            ⚔️ <strong>Prabhas</strong> (Salaar, Radhe Shyam)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            🪓 <strong>Allu Arjun</strong> (Pushpa, Ala Vaikunthapurramuloo)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            🐅 <strong>Jr. NTR</strong> (RRR, Devara)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            ⚡ <strong>Thalapathy Vijay</strong> (Leo, Varisu)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            🌶️ <strong>Mahesh Babu</strong> (Guntur Kaaram, Sarkaru Vaari Paata)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            🕶️ <strong>Victory Venkatesh</strong> (Saindhav, F3)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            🏹 <strong>Ram Charan</strong> (RRR, Vinaya Vidheya Rama)
          </span>
          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
            💰 <strong>Dulquer Salmaan</strong> (Lucky Baskhar, Sita Ramam)
          </span>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="pt-2 sm:pt-4 space-y-2">
        {/* Superstar Spotlight Rows */}
        <MovieRow
          title="Superstar Hits (Dubbed into Kannada)"
          emoji="👑"
          movies={superstars}
          emptyMessage="No superstar dubbed releases found."
        />

        <MovieRow
          title="Star Spotlight: Prabhas (ಕನ್ನಡ Dubbed)"
          emoji="⚔️"
          movies={prabhasMovies}
          emptyMessage="No Prabhas movies found."
        />

        <MovieRow
          title="Star Spotlight: Allu Arjun (ಕನ್ನಡ Dubbed)"
          emoji="🪓"
          movies={alluMovies}
          emptyMessage="No Allu Arjun movies found."
        />

        <MovieRow
          title="Star Spotlight: Jr. NTR (ಕನ್ನಡ Dubbed)"
          emoji="🐅"
          movies={ntrMovies}
          emptyMessage="No Jr. NTR movies found."
        />

        <MovieRow
          title="Star Spotlight: Thalapathy Vijay (ಕನ್ನಡ Dubbed)"
          emoji="⚡"
          movies={vijayMovies}
          emptyMessage="No Thalapathy Vijay movies found."
        />

        <MovieRow
          title="Star Spotlight: Mahesh Babu (ಕನ್ನಡ Dubbed)"
          emoji="🌶️"
          movies={maheshMovies}
          emptyMessage="No Mahesh Babu movies found."
        />

        <MovieRow
          title="Star Spotlight: Victory Venkatesh (ಕನ್ನಡ Dubbed)"
          emoji="🕶️"
          movies={venkyMovies}
          emptyMessage="No Victory Venkatesh movies found."
        />

        <MovieRow
          title="Star Spotlight: Ram Charan (ಕನ್ನಡ Dubbed)"
          emoji="🏹"
          movies={ramCharanMovies}
          emptyMessage="No Ram Charan movies found."
        />

        <MovieRow
          title="Star Spotlight: Dulquer Salmaan (ಕನ್ನಡ Dubbed)"
          emoji="💰"
          movies={dulquerMovies}
          emptyMessage="No Dulquer Salmaan movies found."
        />

        {/* Regular Curated Rows */}
        <MovieRow
          title="Trending in India"
          emoji="🔥"
          movies={trending}
          emptyMessage="Could not load trending movies. Check your API key."
        />

        <MovieRow
          title="ಕನ್ನಡ Originals"
          emoji="🌟"
          movies={kannadaOriginals}
          emptyMessage="No Kannada originals found on these OTTs right now."
        />

        <MovieRow
          title="Hindi Movies (Kannada Dubbed on OTT)"
          emoji="🎬"
          movies={kannadaHindi}
          emptyMessage="No Hindi dubbed movies found."
        />

        <MovieRow
          title="Tamil Movies (Kannada Dubbed on OTT)"
          emoji="🎭"
          movies={kannadaTamil}
          emptyMessage="No Tamil dubbed movies found."
        />

        <MovieRow
          title="Telugu Movies (Kannada Dubbed on OTT)"
          emoji="🌺"
          movies={kannadaTelugu}
          emptyMessage="No Telugu dubbed movies found."
        />

        <MovieRow
          title="Feel Good & Comedy"
          emoji="😄"
          movies={feelGood}
          emptyMessage="No feel-good movies found."
        />

        <MovieRow
          title="Realistic Drama"
          emoji="🎭"
          movies={drama}
          emptyMessage="No drama movies found."
        />

        <MovieRow
          title="Pure Comedy"
          emoji="😂"
          movies={comedy}
          emptyMessage="No comedy movies found."
        />

        <MovieRow
          title="Family Picks"
          emoji="👨‍👩‍👧"
          movies={family}
          emptyMessage="No family movies found."
        />

        <MovieRow
          title="Coming Soon"
          emoji="📅"
          movies={upcoming}
          emptyMessage="No upcoming movies found."
        />
      </div>
    </div>
  );
}
