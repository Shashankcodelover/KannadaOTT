// Navbar — top navigation with search and branding
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, KeyboardEvent } from 'react';
import { OTT_PLATFORMS } from '@/lib/constants';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
        >
          <span className="text-2xl">🎬</span>
          <div>
            <span className="text-white font-black text-lg sm:text-xl tracking-tight">
              KannadaOTT
            </span>
            <span className="hidden sm:block text-zinc-400 text-xs -mt-1">
              Find it. Watch it. In Kannada.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded
              ${pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded
              ${pathname === '/search' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Browse
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search movies..."
                className="
                  bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500
                  rounded-lg px-4 py-2 text-sm w-48 sm:w-64
                  focus:outline-none focus:border-white focus:ring-1 focus:ring-white
                "
              />
              <button
                type="submit"
                className="bg-white text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={toggleSearch}
              className="
                text-zinc-400 hover:text-white transition-colors p-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white
              "
              aria-label="Search movies"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* OTT Platform Strip */}
      <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 pb-3 overflow-x-auto"
           style={{ scrollbarWidth: 'none' }}>
        <span className="text-zinc-500 text-xs whitespace-nowrap mr-1">On:</span>
        {OTT_PLATFORMS.map((platform) => (
          <span
            key={platform.id}
            className="text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${platform.color}20`,
              color: platform.color,
              border: `1px solid ${platform.color}40`,
            }}
          >
            {platform.shortName}
          </span>
        ))}
      </div>
    </nav>
  );
}
