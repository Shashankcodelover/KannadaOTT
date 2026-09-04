'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WatchedMovie {
  id: number;
  title: string;
  poster_path?: string | null;
  watchedAt: number; // timestamp in ms
  expiresAt: number; // watchedAt + 7 days
  ottName?: string;
}

interface WatchedContextType {
  watchedList: WatchedMovie[];
  watchedIds: Set<number>;
  hideWatched: boolean;
  isDraftsOpen: boolean;
  setDraftsOpen: (open: boolean) => void;
  markAsWatched: (
    movie: { id: number; title: string; poster_path?: string | null },
    ottName?: string
  ) => void;
  unmarkAsWatched: (id: number) => void;
  isWatched: (id: number) => boolean;
  clearAllWatched: () => void;
  setHideWatched: (val: boolean) => void;
}

const STORAGE_KEY = 'kannadaott_watched_drafts_v1';
const HIDE_KEY = 'kannadaott_hide_watched_v1';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const WatchedContext = createContext<WatchedContextType | undefined>(undefined);

export function WatchedProvider({ children }: { children: React.ReactNode }) {
  const [watchedList, setWatchedList] = useState<WatchedMovie[]>([]);
  const [hideWatched, setHideWatchedState] = useState<boolean>(true);
  const [isDraftsOpen, setDraftsOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Load from localStorage and auto-delete items older than 1 week
  useEffect(() => {
    try {
      const savedHide = localStorage.getItem(HIDE_KEY);
      if (savedHide !== null) {
        setHideWatchedState(savedHide === 'true');
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: WatchedMovie[] = JSON.parse(saved);
        const now = Date.now();
        // Prune any item older than 7 days
        const active = parsed.filter((item) => item.expiresAt > now);
        setWatchedList(active);
        if (active.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
        }
      }
    } catch (e) {
      console.error('Error reading watched list from localStorage', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to localStorage when list changes
  const persist = useCallback((list: WatchedMovie[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving watched list to localStorage', e);
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

  const markAsWatched = useCallback(
    (
      movie: { id: number; title: string; poster_path?: string | null },
      ottName?: string
    ) => {
      const now = Date.now();
      const expiresAt = now + ONE_WEEK_MS;

      setWatchedList((prev) => {
        const filtered = prev.filter((m) => m.id !== movie.id);
        const next: WatchedMovie[] = [
          {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            watchedAt: now,
            expiresAt,
            ottName,
          },
          ...filtered,
        ];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const unmarkAsWatched = useCallback(
    (id: number) => {
      setWatchedList((prev) => {
        const next = prev.filter((m) => m.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearAllWatched = useCallback(() => {
    setWatchedList([]);
    persist([]);
  }, [persist]);

  const watchedIds = React.useMemo(() => new Set(watchedList.map((m) => m.id)), [watchedList]);

  const isWatched = useCallback(
    (id: number) => {
      if (!loaded) return false;
      return watchedIds.has(id);
    },
    [loaded, watchedIds]
  );

  return (
    <WatchedContext.Provider
      value={{
        watchedList,
        watchedIds,
        hideWatched,
        isDraftsOpen,
        setDraftsOpen,
        markAsWatched,
        unmarkAsWatched,
        isWatched,
        clearAllWatched,
        setHideWatched,
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
