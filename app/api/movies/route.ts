// API Route: GET /api/movies — server-side movie fetching with filters
import { NextRequest, NextResponse } from 'next/server';
import {
  discoverMovies,
  searchMovies,
  enrichMoviesWithProviders,
} from '@/lib/tmdb';
import { OTT_IDS, DEFAULT_YEAR_FROM, CURRENT_YEAR } from '@/lib/constants';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('q') || '';
  const genres = searchParams.get('genres')?.split(',').filter(Boolean).map(Number) || [];
  const ottProviders =
    searchParams.get('ottProviders')?.split(',').filter(Boolean).map(Number) ||
    OTT_IDS;
  const languages = searchParams.get('languages')?.split(',').filter(Boolean) || [];
  const yearFrom = parseInt(searchParams.get('yearFrom') || String(DEFAULT_YEAR_FROM));
  const yearTo = parseInt(searchParams.get('yearTo') || String(CURRENT_YEAR + 1));
  const minRating = parseFloat(searchParams.get('minRating') || '6.0');
  const sortBy = searchParams.get('sortBy') || 'popularity.desc';
  const page = parseInt(searchParams.get('page') || '1');

  try {
    let result;

    if (query.trim()) {
      // Text search
      result = await searchMovies(query.trim(), page);
    } else {
      // Filtered discovery
      result = await discoverMovies({
        genres,
        ottProviders,
        withOriginalLanguage: languages.length === 1 ? languages[0] : undefined,
        yearFrom,
        yearTo,
        minRating,
        sortBy,
        page,
      });
    }

    // Enrich with OTT provider data (limit to 12 for perf)
    const enriched = await enrichMoviesWithProviders(result.results.slice(0, 12));

    return NextResponse.json({
      movies: enriched,
      totalPages: result.total_pages,
      totalResults: result.total_results,
      page: result.page,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
