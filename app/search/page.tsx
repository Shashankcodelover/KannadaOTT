import { Suspense } from 'react';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Movies — KannadaOTT',
  description: 'Search and browse movies by genre, language, OTT platform, and more.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 px-4 sm:px-6 lg:px-8 flex justify-center min-h-screen">
          <div className="flex gap-2 mt-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
