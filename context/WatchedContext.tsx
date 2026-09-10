'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface TrackedMovie {
  id: number;
  title: string;
  poster_path?: string | null;
  trackedAt: number; // timestamp in ms
  expiresAt: number; // trackedAt + 2 years (730 days)
  status: 'watched' | 'deleted' | 'dismissed';
  isLiked?: boolean; // "Except we have been Like it, they want to move on"
  ottName?: string;
  reason?: string;
}

// Backward-compatibility alias
export type WatchedMovie = TrackedMovie;

// 2-Year Retention Cycle (730 Days Bandwidth)
export const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

// Pre-registered deleted/purged titles (Historical, B&W, and Biopics)
// Permanently tracked so sync and repeat runs will never re-import them within the 2-year cycle
export const DEFAULT_PURGED_TITLES: TrackedMovie[] = [
  // Period / Biopic / Historical (Excluded per user instructions)
  { id: 102, title: 'Kaatera', status: 'deleted', reason: '1970s feudal landlord rural period story', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 106, title: 'Vedha', status: 'deleted', reason: '1980s rural period revenge drama', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 111, title: 'Bhajarangi 2', status: 'deleted', reason: 'Ancient fantasy black magic period drama', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 201, title: 'RRR', status: 'deleted', reason: '1920s British colonial period story', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 202, title: '12th Fail', status: 'deleted', reason: 'Academic struggle UPSC biopic', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 207, title: 'Sita Ramam', status: 'deleted', reason: '1960s war & romance period drama', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 208, title: 'Bramayugam', status: 'deleted', reason: '17th-century black and white folklore period drama', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 209, title: 'Boxing Parampare (Sarpatta)', status: 'deleted', reason: '1970s boxing clan period drama', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 210, title: 'Har Har Mahadev', status: 'deleted', reason: '17th-century historical battle biopic', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 229, title: 'Bimbisara', status: 'deleted', reason: '5th-century BC ancient emperor fantasy', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 308, title: 'Sirf Ek Bandaa Kaafi Hai', status: 'deleted', reason: 'Courtroom trial true story biopic', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 309, title: 'Tarla', status: 'deleted', reason: '1970s culinary homemaker biopic', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  // Purged for Lack of Kannada Audio on Streaming Platform / Broken Links / Mismatches
  { id: 211, title: 'Solo Brathuke So Better', status: 'deleted', reason: 'Inaccessible/404 on Zee5 and unverified Kannada dub', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 212, title: 'Kaari', status: 'deleted', reason: 'Catalog page mismatch with TV serial episode format on Zee5', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 215, title: 'Saba Nayagan', status: 'deleted', reason: 'Visited/watched by user & Tamil/Telugu only on Hotstar', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 218, title: 'Bro Daddy', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 219, title: '12th Man', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 220, title: 'Darbar', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Tamil/Telugu/Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 221, title: 'Vikram Vedha', status: 'deleted', reason: 'No Kannada dubbed audio on JioCinema (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 222, title: 'Lover', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 223, title: 'Kishkindha Kaandam', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam/Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 224, title: 'Good Night', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 225, title: 'Por Thozhil', status: 'deleted', reason: 'No Kannada dubbed audio on SonyLIV (Tamil/Telugu/Malayalam only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 226, title: 'Parking', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 227, title: 'Joe', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 228, title: 'Bloody Daddy', status: 'deleted', reason: 'No Kannada dubbed audio on JioCinema (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 233, title: 'Kisi Ka Bhai Kisi Ki Jaan', status: 'deleted', reason: 'Inaccessible/404 on Zee5 & Hindi only', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 234, title: 'Karthikeya 2', status: 'deleted', reason: 'Inaccessible/404 on Zee5 & Telugu/Hindi only', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 235, title: 'Bangarraju', status: 'deleted', reason: 'Inaccessible/404 on Zee5 & Telugu only', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 236, title: 'Falimy', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam/Tamil/Telugu only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 237, title: 'Veera Simha Reddy', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Telugu/Tamil/Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 238, title: 'Selfiee', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 239, title: 'Govinda Naam Mera', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 302, title: 'Manjummel Boys', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam/Tamil/Telugu/Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 213, title: 'Rekke', status: 'deleted', reason: 'Catalog page mismatch with TV serial episode format on Zee5', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 214, title: 'Valimai', status: 'deleted', reason: 'Catalog page redirects to Hindi version on Zee5', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 231, title: 'Salute', status: 'deleted', reason: 'No confirmed Kannada dubbed audio on SonyLIV (Malayalam with English subtitles)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 301, title: 'Premalu', status: 'deleted', reason: 'No Kannada dubbed audio on Hotstar (Malayalam, Tamil & Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 303, title: 'Gargi', status: 'deleted', reason: 'No confirmed Kannada dubbed audio stream on SonyLIV', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 307, title: 'Adiyae', status: 'deleted', reason: 'No confirmed Kannada dubbed audio stream on SonyLIV', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 310, title: 'Zara Hatke Zara Bachke', status: 'deleted', reason: 'No Kannada dubbed audio on JioCinema (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
  { id: 311, title: 'Bhediya', status: 'deleted', reason: 'No Kannada dubbed audio on JioCinema (Hindi only)', trackedAt: 1725580800000, expiresAt: 1725580800000 + TWO_YEARS_MS },
];

interface WatchedContextType {
  // Lists
  trackedList: TrackedMovie[];
  watchedList: TrackedMovie[];
  likedList: TrackedMovie[];
  deletedList: TrackedMovie[];
  // ID Sets
  watchedIds: Set<number>;
  likedIds: Set<number>;
  deletedIds: Set<number>;
  excludedIds: Set<number>; // items hidden from discovery feed
  // Controls
  hideWatched: boolean;
  isDraftsOpen: boolean;
  setDraftsOpen: (open: boolean) => void;
  setHideWatched: (val: boolean) => void;
  // Actions
  markAsWatched: (
    movie: { id: number; title: string; poster_path?: string | null },
    ottName?: string
  ) => void;
  unmarkAsWatched: (id: number) => void;
  dismissMovie: (
    movie: { id: number; title: string; poster_path?: string | null },
    reason?: string
  ) => void;
  toggleLike: (
    movie: { id: number; title: string; poster_path?: string | null }
  ) => void;
  restoreMovie: (id: number) => void;
  clearAllWatched: () => void;
  clearAllDeleted: () => void;
  // Checkers
  isWatched: (id: number) => boolean;
  isLiked: (id: number) => boolean;
  isDismissed: (id: number) => boolean;
  isExcluded: (id: number) => boolean;
}

const STORAGE_KEY = 'kannadaott_2year_tracking_registry_v2';
const HIDE_KEY = 'kannadaott_hide_watched_v1';

const WatchedContext = createContext<WatchedContextType | undefined>(undefined);

export function WatchedProvider({ children }: { children: React.ReactNode }) {
  const [trackedList, setTrackedList] = useState<TrackedMovie[]>([]);
  const [hideWatched, setHideWatchedState] = useState<boolean>(true);
  const [isDraftsOpen, setDraftsOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Load from localStorage and merge default purged items
  useEffect(() => {
    try {
      const savedHide = localStorage.getItem(HIDE_KEY);
      if (savedHide !== null) {
        setHideWatchedState(savedHide === 'true');
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      let combined: TrackedMovie[] = [];

      if (saved) {
        const parsed: TrackedMovie[] = JSON.parse(saved);
        // Retain active items within 2-year window
        combined = parsed.filter((item) => (item.expiresAt || 0) > now);
      }

      // Merge in DEFAULT_PURGED_TITLES if not already tracked
      const existingIds = new Set(combined.map((m) => m.id));
      for (const purged of DEFAULT_PURGED_TITLES) {
        if (!existingIds.has(purged.id)) {
          combined.push(purged);
          existingIds.add(purged.id);
        }
      }

      setTrackedList(combined);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.error('Error reading tracked list from localStorage', e);
      setTrackedList(DEFAULT_PURGED_TITLES);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to localStorage
  const persist = useCallback((list: TrackedMovie[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving tracked list to localStorage', e);
    }
  }, []);

  const setHideWatched = useCallback((val: boolean) => {
    setHideWatchedState(val);
    try {
      localStorage.setItem(HIDE_KEY, String(val));
    } catch (e) {
      console.error('Error saving hideWatched state', e);
    }
  }, []);

  // Mark movie as watched (stored for 2 years cooldown unless liked)
  const markAsWatched = useCallback(
    (
      movie: { id: number; title: string; poster_path?: string | null },
      ottName?: string
    ) => {
      const now = Date.now();
      const expiresAt = now + TWO_YEARS_MS;

      setTrackedList((prev) => {
        const existing = prev.find((m) => m.id === movie.id);
        const filtered = prev.filter((m) => m.id !== movie.id);
        const nextItem: TrackedMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          trackedAt: now,
          expiresAt,
          status: 'watched',
          isLiked: existing?.isLiked ?? false,
          ottName: ottName || existing?.ottName,
        };
        const next = [nextItem, ...filtered];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Dismiss / Delete movie from discovery feed for 2 years
  const dismissMovie = useCallback(
    (
      movie: { id: number; title: string; poster_path?: string | null },
      reason?: string
    ) => {
      const now = Date.now();
      const expiresAt = now + TWO_YEARS_MS;

      setTrackedList((prev) => {
        const filtered = prev.filter((m) => m.id !== movie.id);
        const nextItem: TrackedMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          trackedAt: now,
          expiresAt,
          status: 'dismissed',
          reason: reason || 'User dismissed from 2-year discovery cycle',
        };
        const next = [nextItem, ...filtered];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Toggle "Liked / Recollect ❤️"
  // "Except we have been Like it, they want to move on"
  const toggleLike = useCallback(
    (movie: { id: number; title: string; poster_path?: string | null }) => {
      setTrackedList((prev) => {
        const existing = prev.find((m) => m.id === movie.id);
        const now = Date.now();
        const expiresAt = now + TWO_YEARS_MS;

        let next: TrackedMovie[];
        if (existing) {
          const newLiked = !existing.isLiked;
          next = prev.map((m) =>
            m.id === movie.id ? { ...m, isLiked: newLiked } : m
          );
        } else {
          // Add as new liked item
          next = [
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              trackedAt: now,
              expiresAt,
              status: 'watched',
              isLiked: true,
            },
            ...prev,
          ];
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Restore movie back to discovery feed
  const restoreMovie = useCallback(
    (id: number) => {
      setTrackedList((prev) => {
        const next = prev.filter((m) => m.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const unmarkAsWatched = useCallback(
    (id: number) => {
      restoreMovie(id);
    },
    [restoreMovie]
  );

  const clearAllWatched = useCallback(() => {
    setTrackedList((prev) => {
      // Retain only deleted/purged titles, clear user watched items
      const next = prev.filter((m) => m.status === 'deleted');
      persist(next);
      return next;
    });
  }, [persist]);

  const clearAllDeleted = useCallback(() => {
    setTrackedList((prev) => {
      // Retain watched items, clear user dismissed
      const next = prev.filter((m) => m.status === 'watched');
      persist(next);
      return next;
    });
  }, [persist]);

  // Derived lists
  const watchedList = useMemo(
    () => trackedList.filter((m) => m.status === 'watched'),
    [trackedList]
  );
  const likedList = useMemo(
    () => trackedList.filter((m) => !!m.isLiked),
    [trackedList]
  );
  const deletedList = useMemo(
    () => trackedList.filter((m) => m.status === 'deleted' || m.status === 'dismissed'),
    [trackedList]
  );

  // ID sets for fast lookup
  const watchedIds = useMemo(
    () => new Set(watchedList.map((m) => m.id)),
    [watchedList]
  );
  const likedIds = useMemo(
    () => new Set(likedList.map((m) => m.id)),
    [likedList]
  );
  const deletedIds = useMemo(
    () => new Set(deletedList.map((m) => m.id)),
    [deletedList]
  );

  // An item is excluded from discovery if it is watched or deleted/dismissed, EXCEPT if the user liked it
  const excludedIds = useMemo(() => {
    const s = new Set<number>();
    for (const m of trackedList) {
      if (!m.isLiked) {
        s.add(m.id);
      }
    }
    return s;
  }, [trackedList]);

  const isWatched = useCallback(
    (id: number) => {
      if (!loaded) return false;
      return watchedIds.has(id);
    },
    [loaded, watchedIds]
  );

  const isLiked = useCallback(
    (id: number) => {
      if (!loaded) return false;
      return likedIds.has(id);
    },
    [loaded, likedIds]
  );

  const isDismissed = useCallback(
    (id: number) => {
      if (!loaded) return false;
      return deletedIds.has(id);
    },
    [loaded, deletedIds]
  );

  const isExcluded = useCallback(
    (id: number) => {
      if (!loaded) return false;
      return excludedIds.has(id);
    },
    [loaded, excludedIds]
  );

  return (
    <WatchedContext.Provider
      value={{
        trackedList,
        watchedList,
        likedList,
        deletedList,
        watchedIds,
        likedIds,
        deletedIds,
        excludedIds,
        hideWatched,
        isDraftsOpen,
        setDraftsOpen,
        setHideWatched,
        markAsWatched,
        unmarkAsWatched,
        dismissMovie,
        toggleLike,
        restoreMovie,
        clearAllWatched,
        clearAllDeleted,
        isWatched,
        isLiked,
        isDismissed,
        isExcluded,
      }}
    >
      {children}
    </WatchedContext.Provider>
  );
}

export function useWatched() {
  const ctx = useContext(WatchedContext);
  if (!ctx) {
    throw new Error('useWatched must be used within a WatchedProvider');
  }
  return ctx;
}
